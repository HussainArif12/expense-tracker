import { PieChart } from '#/components/PieChart'
import type { ChartDatum } from '#/types/ChartDatum'
import React from 'react'
import { InfoDisplay } from './InfoDisplay'
import { BarChart } from './BarChart'

type TradingOverviewOneMonthDisplay = {
  dataToRender: { data: ChartDatum[] | undefined; title: string }[]
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
export const OverviewDisplay: React.FC<TradingOverviewOneMonthDisplay> = ({
  dataToRender,
  pieMode,
}) => {
  return (
    <>
      {dataToRender.map(
        (section, index) =>
          section.data && (
            <InfoDisplay
              cssOverrideParent="h-[600px]"
              title={section.title}
              key={index}
            >
              <ModeSwitcher
                pieMode={pieMode}
                PieModeComponent={PieChart}
                ChartModeComponent={BarChart}
                data={section.data}
              />
            </InfoDisplay>
          ),
      )}
    </>
  )
}
