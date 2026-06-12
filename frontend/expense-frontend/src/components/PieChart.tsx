import type React from 'react'
import type { PieLabelRenderProps, PieSectorShapeProps } from 'recharts'
import { Pie, PieChart as PieChartRenderer, Sector, Tooltip } from 'recharts'

type PieChartDataProps = {
  data: { name: string; value: number; color: string }[]
}

export const PieChart: React.FC<PieChartDataProps> = ({ data }) => {
  const colors = data.map((item) => item.color)
  const MyCustomPie = (props: PieSectorShapeProps) => (
    <Sector {...props} fill={colors[props.index % colors.length]} />
  )

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const percent = props.percent ?? 0

    if (!percent) return null // Don't show zeros
    return `${(percent * 100).toFixed(1)}%`
  }

  return (
    <PieChartRenderer
      reverseStackOrder={true}
      style={{
        width: '100%',
        maxWidth: '880px',
        maxHeight: '90vh',
        aspectRatio: 1.7,
        paddingTop: '10%',
      }}
    >
      <Pie
        data={data}
        dataKey={'value'}
        cx="50%" // Centers the pie horizontally
        cy="50%"
        outerRadius="90%"
        shape={MyCustomPie}
        label={renderCustomizedLabel}
      />
      <Tooltip />
    </PieChartRenderer>
  )
}
