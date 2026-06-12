import type { ChartDatum } from '#/types/ChartDatum'
import type React from 'react'
import {
  BarChart as RechartsBarChart, // Renamed alias for clarity
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

type BarChartProps = {
  data: ChartDatum[]
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <>
      <RechartsBarChart
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '80vh',
          aspectRatio: 1.7,
          paddingTop: '10%',
        }}
        responsive
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar
          dataKey="value"
          fill={'#9d174d'}
          activeBar={{ fill: '#93c5fd', stroke: '#f9a8d4' }}
        />
      </RechartsBarChart>
    </>
  )
}
