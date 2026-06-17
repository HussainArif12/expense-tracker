export interface MonthlyMerchantRow {
  'Month & Year': string
  [merchantName: string]: string | number
}

export interface MonthlyStockRow {
  'Month & Year': string
  [stockTickerOrName: string]: string | number
}

export interface T212GRoupedData {
  merchant_name_grouped: MonthlyMerchantRow[]
  stocks_by_time: MonthlyStockRow[]
}
