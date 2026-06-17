type Flow = {
  [key: string]: number
}
export type MerchantGroupedSparkasse = {
  inflow_grouped: Flow[]
  outflow_grouped: Flow[]
}
