import { hexy } from '#/utils/generateRandomColor'
import React, { useMemo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type LineChartProps = {
  data: LineChartData[]
  xAxisKey: string // Tells the chart which key represents the bottom axis (e.g., "Month & Year")
}
export const LineChart: React.FC<LineChartProps> = ({ data, xAxisKey }) => {
  // 1. Dynamically figure out what lines to draw based on the data keys.
  // It looks at the first object in your array and ignores the xAxisKey.
  const lineKeys = useMemo(() => {
    if (data.length === 0) return []

    return Object.keys(data[0]).filter((key) => key !== xAxisKey)
  }, [data, xAxisKey])

  return (
    <RechartsLineChart
      style={{
        width: '100%',
        maxWidth: '850px',
        height: '90%',
        maxHeight: '800vh',
        paddingTop: '10%',
      }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 50,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} tickMargin={10} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip />
      <Legend wrapperStyle={{ paddingTop: '20px' }} />

      {/* 3. Render a unique line for every merchant found in the data */}
      {lineKeys.map((key) => (
        <Line
          key={key}
          type="monotone"
          dataKey={key}
          stroke={hexy()}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      ))}
    </RechartsLineChart>
  )
}
