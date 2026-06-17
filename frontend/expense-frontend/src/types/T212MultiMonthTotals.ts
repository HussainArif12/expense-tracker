export interface FinancialTotals {
  total_cashback: number
  total_expenses: number
  total_dividends: number
  total_interest: number
  total_stocks: number
}

export type MonthlyTimeline = Record<string, number> // Maps 'YYYY-MM' strings to numeric values

export interface FinancialChartingData {
  cashback: MonthlyTimeline
  dividends: MonthlyTimeline
  interest: MonthlyTimeline
  expenses: MonthlyTimeline
  stocks: MonthlyTimeline

  // Dynamic collections mapping names to total allocated values
  stocks_by_name: {
    [stockTickerOrName: string]: number
  }
  merchant_name: {
    [merchantName: string]: number
  }
  merchant_category: {
    [categoryName: string]: number
  }
}

export interface T212MultiMonthTotals {
  totals: FinancialTotals
  charting_data: FinancialChartingData
}
