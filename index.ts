import { Config, User } from "./src/config-types";
import { CwRedirect } from "./src/cw-redirect-types";
import { CwRoot, Item } from "./src/cw-types";
import Mailjet from "node-mailjet";
import { Data } from "./src/data-types";

const isRedirect = (obj: any): obj is CwRedirect => {
  return obj.redirect;
};

const isItems = (obj: any): obj is CwRoot => {
  return obj.universes;
};

const getItems = async (search: string) => {
  const result = await fetch(
    `https://pds.chemistwarehouse.com.au/search?identifier=AU&fh_start_index=0&fh_location=%2F%2Fcatalog01%2Fen_AU%2Fcategories%3C%7Bcatalog01_chemau%7D%2F%24s%3D${encodeURIComponent(search)}`
  );
  // console.log(await result.text());
  let body = await result.json();
  if (isRedirect(body)) {
    const match = body.redirect["redirect-url"].match(/shop-online\/(\d+)\//);
    if (match == null) {
      return [];
    }
    const id = match[1];
    const result = await fetch(
      `https://pds.chemistwarehouse.com.au/search?identifier=AU&fh_start_index=0&fh_location=%2F%2Fcatalog01%2Fen_AU%2Fcategories%3C%7Bcatalog01_chemau%7D%2Fcategories%3C%7Bchemau${id}%7D`
    );
    body = await result.json();
  }
  if (isItems(body)) {
    return body.universes.universe[0]["items-section"].items.item;
  }
  return [];
};

const getItemAttributes = (items: Item[], attrs: string[]) => {
  return items.map((item) =>
    attrs.reduce(
      (acc, attr) => {
        acc[attr] =
          item.attribute.find((x) => x.name == attr)?.value[0].value ?? "";
        return acc;
      },
      {} as Record<string, string | number>
    )
  );
};

const calculateDiscounts = (items: Record<string, string | number>[]) => {
  return items.map((x) => {
    const cwPrice = parseFloat(x.price_cw_au as string);
    const rrpPrice = parseFloat(x.rrp_cw_au as string);
    x.discount = (rrpPrice - cwPrice) / rrpPrice;
    return x;
  });
};

type ExtractedItems = Record<string, string | number>[];

const generateEmailHtml = (
  found: { search: string; items: ExtractedItems }[]
) => {
  const stringList = [];
  for (const f of found) {
    stringList.push(`<h2>From ${f.search}</h2>`);
    stringList.push("<table>");
    stringList.push(
      "<tr><td></td><td>Name</td><td>Price</td><td>MSRP</td></tr>"
    );
    for (const i of f.items) {
      stringList.push("<tr>");
      stringList.push(`<td><img src="${i._thumburl}"></td>`);
      stringList.push(`<td>${i.name}</td>`);
      stringList.push(`<td>$${i.price_cw_au}</td>`);
      stringList.push(`<td>$${i.rrp_cw_au}</td>`);
      stringList.push("</tr>");
    }
    stringList.push("</table>");
  }
  return stringList.join("\n");
};

const runUser = async (user: User, dataRef: Data) => {
  console.log(`running user ${user.email}`);

  const notifyItems = [];
  for (const query of user.queries) {
    console.log(`running query ${query.search}`);

    const items = calculateDiscounts(
      getItemAttributes(await getItems(query.search), [
        "name",
        "price_cw_au",
        "rrp_cw_au",
        "_thumburl",
      ])
    );
    console.log(`found ${items.length} items`);

    const threshold = query.threshold ?? user.threshold;
    const nItems = items.filter((x) => (x.discount as number) >= threshold);
    if (nItems.length > 0) {
      console.log(`found ${nItems.length} items above threshold`);
      notifyItems.push({ search: query.search, items: nItems });
    }
  }

  const messageHash = Bun.hash(JSON.stringify(notifyItems));
  // Already reported
  if (dataRef.users[user.email].lastMessageHash == Number(messageHash)) {
    console.log("already notified, skipping email");
    return;
  }

  const mailClient = Mailjet.Client.apiConnect(
    process.env.MJ_PUBLIC_KEY ?? "",
    process.env.MJ_SECRET_KEY ?? ""
  );

  try {
    if (notifyItems.length > 0) {
      await mailClient.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: { Email: process.env.MJ_SENDER_EMAIL },
            To: [{ Email: user.email }],
            Subject: `Chemist Warehouse items on discount`,
            TextPart: `A number of watched items are on larger discount`,
            HTMLPart: generateEmailHtml(notifyItems),
          },
        ],
      });
      console.log("mail sent");
    } else if (!dataRef.users[user.email]) {
      await mailClient.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: { Email: process.env.MJ_SENDER_EMAIL },
            To: [{ Email: user.email }],
            Subject: `Chemist Warehouse item watcher test email`,
            TextPart: `This is a test email`,
            HTMLPart:
              "You may want to move this email out of spam so actual notifications in the future are not missed",
          },
        ],
      });
      console.log("test mail send for uninitialized user");
      dataRef.users[user.email] = { lastMessageHash: 0 };
    } else {
      // Nothing to report
      return;
    }
    // Store item hash to avoid duplicate notifications
    dataRef.users[user.email].lastMessageHash = Number(messageHash);
  } catch (error) {
    console.log(`failed to send mail ${error}`);
  }
};

const configPath = "./config.json";
const dataPath = "./data.json";

const runConfig = async () => {
  const config = (await Bun.file(configPath).json()) as Config;
  const dataFile = Bun.file(dataPath);
  let data: Data;
  if (await dataFile.exists()) data = (await dataFile.json()) as Data;
  else data = { users: {} } as Data;
  await Promise.all(config.users.map((user) => runUser(user, data)));
  await Bun.write(dataPath, JSON.stringify(data));
};

runConfig().then((x) => console.log("finished scan"));
