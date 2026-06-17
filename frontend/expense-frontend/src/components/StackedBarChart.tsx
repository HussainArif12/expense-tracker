import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type StackedBarChartProps = {
  data: {
    name: string
    'Bank Outflow': number | undefined
    'Trading Outflow': number | undefined
    'Bank Inflow'?: undefined | number
    'Trading Inflow'?: undefined | number
  }[]
}
const StackedBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
        <Legend />

        {/* 2. The Magic: StackId connects the bars. 
            Because they share stackId="a", segments on the same X-Axis point will stack vertically.
          */}
        <Bar dataKey="Bank Inflow" stackId="a" fill="#4ade80" />
        <Bar dataKey="Trading Inflow" stackId="a" fill="#22c55e" />

        <Bar dataKey="Bank Outflow" stackId="a" fill="#f87171" />
        <Bar dataKey="Trading Outflow" stackId="a" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}
export default StackedBarChart
