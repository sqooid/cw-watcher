import { CwRedirect } from "./src/cw-redirect-types";
import { CwRoot, Item } from "./src/cw-types";

const isRedirect = (obj: any): obj is CwRedirect => {
  return obj.redirect;
};

const isItems = (obj: any): obj is CwRoot => {
  return obj.universes;
};

const get_items = async (search: string) => {
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

const listItemNames = (items: Item[]) =>
  items.map((x) => x.attribute.find((x) => x.name == "name")?.value[0].value);

get_items("sukin").then((x) =>
  console.log(
    calculateDiscounts(
      getItemAttributes(x, ["name", "price_cw_au", "rrp_cw_au", "_thumburl"])
    )
  )
);
