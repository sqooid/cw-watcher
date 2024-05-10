export interface Root {
  info: Info
  universes: Universes
  footer: Footer
  qid: string
  rid: string
}

export interface Info {
  session: string
  "user-type": string
  lang: string
  country: string
  locale: Locale
  "current-universe": string
  view: string
  mode: string
  query: string
  path: string
  type: string
  "query-string-httpencoded": string
  ranges: Ranges
  url: string
  "source-xml": string
  server: Server
}

export interface Locale {
  value: string
  selected: boolean
  mlvalue: string
}

export interface Ranges {
  "query-ranges": QueryRanges
  "implicit-ranges": ImplicitRanges
}

export interface QueryRanges {
  range: string[]
}

export interface ImplicitRanges {
  range: any[]
}

export interface Server {
  "encoding-detect-string": string
  host: string
  port: number
  "context-root": string
  role: string
  "config-dir": string
  locales: Locales
  "default-universe": string
}

export interface Locales {
  locale: Locale2[]
}

export interface Locale2 {
  value: string
  selected: boolean
  mlvalue: string
}

export interface Universes {
  universe: Universe[]
}

export interface Universe {
  link: Link
  facetmap: Facetmap[]
  breadcrumbs: Breadcrumbs
  "items-section": ItemsSection
  themes: Theme[]
  "display-fields": DisplayFields
  "attribute-types": AttributeTypes3
  name: string
  type: string
}

export interface Link {
  name: string
  "url-params": string
}

export interface Facetmap {
  filter: Filter[]
  universe: string
}

export interface Filter {
  title: string
  filtersection: Filtersection[]
  "url-params-base": string
  "custom-fields": CustomFields
  on: string
  facetid: string
  basetype: string
  "show-number-values": number
  "display-hint": string[]
}

export interface Filtersection {
  link: Link2
  value: Value
  nr: number
}

export interface Link2 {
  name: string
  "url-params": string
}

export interface Value {
  value: string
}

export interface CustomFields {
  "custom-field": CustomField[]
}

export interface CustomField {
  value: string
  name: string
  id: string
}

export interface Breadcrumbs {
  crumb: Crumb[]
  "attribute-types": AttributeTypes
  "nr-of-items-in-selection": number
}

export interface Crumb {
  "url-params": string
  name: Name
  link: Link3[]
  range?: Range
}

export interface Name {
  value: string
  type?: string
  "non-ml": string
  "attribute-type"?: string
}

export interface Link3 {
  name: string
  "url-params": string
  type: string
}

export interface Range {
  "value-set": ValueSet[]
  invert: boolean
}

export interface ValueSet {
  entry: Entry[]
  constraint: string
  aggregation: string
}

export interface Entry {
  value: Value2
  link: Link4[]
}

export interface Value2 {
  value: string
  "non-ml": string
}

export interface Link4 {
  name: string
  "url-params": string
  type: string
}

export interface AttributeTypes {
  "attribute-type": AttributeType[]
}

export interface AttributeType {
  value: string
  name: string
  basetype: string
}

export interface ItemsSection {
  results: Results
  heading: Heading
  items: Items
}

export interface Results {
  "url-params": string
  ranking: Ranking
  "view-size": number
  "view-set-size": string
  "total-items": number
  "start-index": number
  "view-size-param": string
  "start-index-param": string
  "current-set": number
}

export interface Ranking {
  id: string
  "sort-fields": SortFields
}

export interface SortFields {
  "sort-field": SortField[]
}

export interface SortField {
  "sort-direction": string
  "sort-attribute": string
}

export interface Heading {
  link: Link5[]
}

export interface Link5 {
  name: string
  "url-params": string
  value: Value3
}

export interface Value3 {
  value: string
}

export interface Items {
  item: Item[]
}

export interface Item {
  attribute: Attribute[]
  link: Link6[]
  id: string
}

export interface Attribute {
  value: Value4[]
  name: string
  basetype: string
  isnull: boolean
  selected: boolean
  "best-matched": boolean
}

export interface Value4 {
  value: string
  "non-ml": string
}

export interface Link6 {
  name: string
  "url-params": string
  type: string
}

export interface Theme {
  theme: any[]
  "attribute-types": AttributeTypes2
}

export interface AttributeTypes2 {
  "attribute-type": AttributeType2[]
}

export interface AttributeType2 {
  value: string
  name: string
  type: string
}

export interface DisplayFields {
  field: Field[]
}

export interface Field {
  name: string
  basetype: string
  reverse: boolean
  skey: string
  type: string
}

export interface AttributeTypes3 {
  "attribute-type": AttributeType3[]
}

export interface AttributeType3 {
  value: string
  name: string
  basetype: string
}

export interface Footer {
  "process-time": ProcessTime
  "log-args": string
}

export interface ProcessTime {
  value: string
  unit: string
}
