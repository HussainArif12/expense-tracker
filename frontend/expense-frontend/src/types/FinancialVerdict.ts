export interface FinancialVerdict {
  outcome: Outcome[]
}

export interface Outcome {
  type: string
  trading_outflow?: number
  bank_outflow?: number
  bank_inflow?: number
}
