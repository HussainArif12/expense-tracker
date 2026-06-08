export interface TradingOverview {
  total_expenses: {
    [date: string]: number
  }
  total_expenses_sum: number
  stocks_only: {
    [stockName: string]: number // Optional: keeps it flexible for other stocks
  }
  interest_earned: number
  cashback: number
}
