export interface FinancialOverview {
  outflow: number
  inflow: number

  costs_grouped: {
    [institutionName: string]: number
  }
  inflow_grouped: {
    [senderName: string]: number
  }
  costs_grouped_by_time: {
    [dayNumber: string]: number
  }
}
