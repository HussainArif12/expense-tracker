import type React from 'react'
import type { PieLabelRenderProps, PieSectorShapeProps } from 'recharts'
import {
  Pie,
  PieChart as PieChartRenderer,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from 'recharts'

type PieChartDataProps = {
  data: { name: string; value: number; color: string }[]
  title: string
}

export const PieChart: React.FC<PieChartDataProps> = ({ data, title }) => {
  const colors = data.map((item) => item.color)
  const MyCustomPie = (props: PieSectorShapeProps) => (
    <Sector {...props} fill={colors[props.index % colors.length]} />
  )

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const percent = props.percent ?? 0
    const name = props.name ?? ''
    if (!percent) return null // Don't show zeros
    return `${(percent * 100).toFixed(1)}%`
  }

  return (
    <div className="h-[600px] w-full rounded-md border-solid border-4 border-pink-300 p-4">
      <div className="w-full bg-blue-300 text-center rounded-md">
        <p className=" p-[0.5px]">{title}</p>
      </div>
      <ResponsiveContainer height="100%" width="100%">
        <PieChartRenderer title={title} reverseStackOrder={true}>
          <p>hi</p>
          <Pie
            data={data}
            dataKey={'value'}
            cx="50%" // Centers the pie horizontally
            cy="50%"
            outerRadius="80%"
            shape={MyCustomPie}
            label={renderCustomizedLabel}
          />
          <Tooltip />
        </PieChartRenderer>
      </ResponsiveContainer>
    </div>
  )
}
