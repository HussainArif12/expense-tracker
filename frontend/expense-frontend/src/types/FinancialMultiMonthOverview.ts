export interface FinancialMultiMonthOverview {
  inflow_total: number
  outflow_total: number

  // Maps monthly date keys (e.g., '2026-05') to the corresponding currency total
  inflow_grouped: {
    [yearMonth: string]: number
  }

  outflow_grouped: {
    [yearMonth: string]: number
  }
}
