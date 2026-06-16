export interface IncomeRecord {
  Buchungstag: string
  Buchungstext: string
  Verwendungszweck: string
  'Beguenstigter/Zahlungspflichtiger': string
  Betrag: number
}

export interface FinancialOverview {
  outflow: number
  inflow: number

  costs_grouped: {
    [institutionName: string]: number
  }
  inflow_grouped: {
    [senderName: string]: number
  }
  detected_income: IncomeRecord[]
}
