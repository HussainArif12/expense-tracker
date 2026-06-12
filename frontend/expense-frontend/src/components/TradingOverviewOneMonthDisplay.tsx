import { PieChart } from '#/components/PieChart'
import type { ChartDatum } from '#/types/ChartDatum'
import React from 'react'
import { InfoDisplay } from './InfoDisplay'
import { BarChart } from './BarChart'

type TradingOverviewOneMonthDisplay = {
  totalExpensesToRender: ChartDatum[] | undefined
  stocksBoughtToRender: ChartDatum[] | undefined
  merchantsGroupedToRender: ChartDatum[] | undefined
  merchantsCategoryGroupedToRender: ChartDatum[] | undefined
  dividendsToRender: ChartDatum[] | undefined
  pieMode: boolean
}

type ModeSwitcherProps = {
  pieMode: boolean
  PieModeComponent: React.ComponentType<{ data: ChartDatum[] }>
  ChartModeComponent: React.ComponentType<{ data: ChartDatum[] }>
  data: ChartDatum[]
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  pieMode,
  PieModeComponent,
  ChartModeComponent,
  data,
}) => {
  return (
    <>
      {pieMode ? (
        <PieModeComponent data={data} />
      ) : (
        <ChartModeComponent data={data} />
      )}
    </>
  )
}
export const TradingOverviewOneMonthDisplay: React.FC<
  TradingOverviewOneMonthDisplay
> = ({
  totalExpensesToRender,
  stocksBoughtToRender,
  merchantsGroupedToRender,
  merchantsCategoryGroupedToRender,
  dividendsToRender,
  pieMode,
}) => {
  return (
    <>
      {totalExpensesToRender && (
        <InfoDisplay
          cssOverrideParent="h-[600px]"
          title="Total expenses with respect to time"
        >
          <ModeSwitcher
            pieMode={pieMode}
            PieModeComponent={PieChart}
            ChartModeComponent={BarChart}
            data={totalExpensesToRender}
          />
        </InfoDisplay>
      )}
      {stocksBoughtToRender && (
        <InfoDisplay cssOverrideParent="h-[600px]" title="Stocks bought">
          <ModeSwitcher
            pieMode={pieMode}
            PieModeComponent={PieChart}
            ChartModeComponent={BarChart}
            data={stocksBoughtToRender}
          />
        </InfoDisplay>
      )}
      {merchantsGroupedToRender && (
        <InfoDisplay
          cssOverrideParent="h-[600px]"
          title="Purchases by merchant name"
        >
          <ModeSwitcher
            pieMode={pieMode}
            PieModeComponent={PieChart}
            ChartModeComponent={BarChart}
            data={merchantsGroupedToRender}
          />
        </InfoDisplay>
      )}
      {merchantsCategoryGroupedToRender && (
        <InfoDisplay
          cssOverrideParent="h-[600px]"
          title="Purchases by merchant category"
        >
          <ModeSwitcher
            pieMode={pieMode}
            PieModeComponent={PieChart}
            ChartModeComponent={BarChart}
            data={merchantsCategoryGroupedToRender}
          />
        </InfoDisplay>
      )}
      {dividendsToRender && (
        <InfoDisplay
          cssOverrideParent="h-[600px]"
          title="Dividends earned by symbol"
        >
          <ModeSwitcher
            pieMode={pieMode}
            PieModeComponent={PieChart}
            ChartModeComponent={BarChart}
            data={dividendsToRender}
          />
        </InfoDisplay>
      )}
    </>
  )
}
