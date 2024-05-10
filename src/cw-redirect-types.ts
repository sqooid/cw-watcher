export interface CwRedirect {
  info: Info;
  redirect: Redirect;
  footer: Footer;
  qid: string;
  rid: string;
}

export interface Info {
  session: string;
  "user-type": string;
  lang: string;
  country: string;
  locale: Locale;
  "current-universe": string;
  view: string;
  mode: string;
  query: string;
  path: string;
  type: string;
  "query-string-httpencoded": string;
  ranges: Ranges;
  url: string;
  "source-xml": string;
  server: Server;
}

export interface Locale {
  value: string;
  selected: boolean;
  mlvalue: string;
}

export interface Ranges {
  "query-ranges": QueryRanges;
  "implicit-ranges": ImplicitRanges;
}

export interface QueryRanges {
  range: string[];
}

export interface ImplicitRanges {
  range: any[];
}

export interface Server {
  "encoding-detect-string": string;
  host: string;
  port: number;
  "context-root": string;
  role: string;
  "config-dir": string;
  locales: Locales;
  "default-universe": string;
}

export interface Locales {
  locale: Locale2[];
}

export interface Locale2 {
  value: string;
  selected: boolean;
  mlvalue: string;
}

export interface Redirect {
  "redirect-host": string;
  "redirect-port": number;
  "redirect-url": string;
  id: string;
}

export interface Footer {
  "process-time": ProcessTime;
  "log-args": string;
}

export interface ProcessTime {
  value: string;
  unit: string;
}
