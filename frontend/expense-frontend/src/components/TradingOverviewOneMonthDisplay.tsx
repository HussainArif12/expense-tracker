import { PieChart } from '#/components/PieChart'
import type { ChartDatum } from '#/types/ChartDatum'
import React from 'react'

type TradingOverviewOneMonthDisplay = {
  totalExpensesToRender: ChartDatum[] | undefined
  stocksBoughtToRender: ChartDatum[] | undefined
  merchantsGroupedToRender: ChartDatum[] | undefined
  merchantsCategoryGroupedToRender: ChartDatum[] | undefined
}
export const TradingOverviewOneMonthDisplay: React.FC<
  TradingOverviewOneMonthDisplay
> = ({
  totalExpensesToRender,
  stocksBoughtToRender,
  merchantsGroupedToRender,
  merchantsCategoryGroupedToRender,
}) => {
  return (
    <>
      {totalExpensesToRender && (
        <PieChart data={totalExpensesToRender} title="Expenses by day" />
      )}
      {stocksBoughtToRender && (
        <PieChart data={stocksBoughtToRender} title="Stocks bought" />
      )}
      {merchantsGroupedToRender && (
        <PieChart
          data={merchantsGroupedToRender}
          title="Purchases by merchant name"
        />
      )}
      {merchantsCategoryGroupedToRender && (
        <PieChart
          data={merchantsCategoryGroupedToRender}
          title="Purchases by merchant category"
        />
      )}
    </>
  )
}
