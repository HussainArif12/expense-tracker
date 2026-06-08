import type React from 'react'
import Plotly from 'react-plotly.js'
type PieChartDataProps = {
  data: Record<string, number>
}
export const PieChart: React.FC<PieChartDataProps> = ({ data }) => {
  const dataToRender = {
    labels: Object.keys(data),
    values: Object.values(data),
  }

  return <div></div>
}
