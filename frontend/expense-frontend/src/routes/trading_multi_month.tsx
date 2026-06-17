import { InfoDisplay } from '#/components/InfoDisplay'
import { LineChart } from '#/components/LineChart'
import { OverviewDisplay } from '#/components/OverviewDisplay'
import type { T212GRoupedData } from '#/types/T212GroupedData'
import type { T212MultiMonthTotals } from '#/types/T212MultiMonthTotals'
import { postFormClient } from '#/utils/post_form'
import { createFileRoute } from '@tanstack/react-router'

import type { ChangeEvent } from 'react'
import React, { useState } from 'react'

const toChartData = (record?: Record<string, number>) =>
  record
    ? Object.entries(record).map(([name, value]) => ({ name, value }))
    : undefined

export const Route = createFileRoute('/trading_multi_month')({
  component: RouteComponent,
})

function RouteComponent() {
  const [tradingFile, setTradingFile] = useState<File | null>(null)
  const [pieMode, setPieMode] = useState(false)
  const [dataTotalExpenses, setDataTotalExpenses] =
    useState<T212MultiMonthTotals>()
  const [groupedData, setGroupedData] = useState<T212GRoupedData>()
  const chartingData = dataTotalExpenses?.charting_data
  const stocksOnlyToRenderByName = toChartData(chartingData?.stocks_by_name)
  const merchantToRenderByName = toChartData(chartingData?.merchant_name)
  const merchantToRenderByCategory = toChartData(
    chartingData?.merchant_category,
  )

  const expenseWithoutStocks = dataTotalExpenses
    ? (
        dataTotalExpenses.totals.total_expenses -
        dataTotalExpenses.totals.total_stocks
      ).toFixed(2)
    : '0'

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTradingFile(event.target.files?.[0] ?? null)
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!tradingFile) return

    const formData = new FormData()
    formData.append('csvFile', tradingFile)

    const [totalExpensesResponse, groupedDataResponse] = await Promise.all([
      postFormClient('/trading_multi_month/total_expenses', formData),
      postFormClient('/trading_multi_month/grouped_data', formData),
    ])

    setGroupedData(groupedDataResponse)
    setDataTotalExpenses(totalExpensesResponse)
  }

  const dataToRender = [
    { data: stocksOnlyToRenderByName, title: 'Stocks by name' },
    { data: merchantToRenderByName, title: 'Expenses by merchant' },
    {
      data: merchantToRenderByCategory,
      title: 'Expenses by merchant category',
    },
  ]
  const lineChartDataToRender = [
    { data: toChartData(chartingData?.cashback), title: 'Cashback by month' },
    {
      data: toChartData(chartingData?.stocks),
      title: 'Stock expenses by month',
    },
    {
      data: toChartData(chartingData?.expenses),
      title: 'Expenses by month (including stock)',
    },
    { data: toChartData(chartingData?.dividends), title: 'Dividends by month' },
    { data: toChartData(chartingData?.interest), title: 'Interest by month' },
  ]

  const groupedLineChartDataToRender = [
    {
      data: groupedData?.merchant_name_grouped,
      title: 'Expenses of each merchant by time',
    },
    {
      data: groupedData?.stocks_by_time,
      title: 'Buying of stocks by time ',
    },
  ]
  return (
    <div className="px-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          htmlFor="csvFile"
          className="block text-sm font-medium text-slate-700"
        >
          Upload CSV file
        </label>
        <input
          id="csvFile"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="bg-yellow-300 rounded-md p-1"
        />
        <button
          type="submit"
          disabled={!tradingFile}
          className="bg-blue-300 rounded-md p-1 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          Submit
        </button>
      </form>
      <input
        type="checkbox"
        id="pieMode"
        title="Pie mode"
        onChange={(event) => setPieMode(event.currentTarget.checked)}
      />
      <label htmlFor="pieMode">Pie Mode</label>
      {dataTotalExpenses && (
        <div className="grid  grid-cols-1 lg:grid-cols-2  w-full gap-x-1 gap-y-1 my-4">
          <InfoDisplay title="Total Expenses (including stock)">
            <h1 className="text-9xl text-center">
              {dataTotalExpenses.totals.total_expenses.toFixed(2)}
            </h1>
            <p>
              Total without stocks:{' '}
              <span className="font-bold text-xl ">{expenseWithoutStocks}</span>
            </p>
          </InfoDisplay>
          <InfoDisplay title="Total Cashback">
            <h1 className="text-9xl text-center">
              {dataTotalExpenses.totals.total_cashback.toFixed(2)}
            </h1>
          </InfoDisplay>
          <InfoDisplay title="Total Interest">
            <h1 className="text-9xl text-center">
              {dataTotalExpenses.totals.total_interest.toFixed(2)}
            </h1>
          </InfoDisplay>
          <InfoDisplay title="Total Dividends">
            <h1 className="text-9xl text-center">
              {dataTotalExpenses.totals.total_dividends.toFixed(2)}
            </h1>
          </InfoDisplay>
        </div>
      )}

      <div className="grid  grid-cols-1 lg:grid-cols-2  w-full gap-x-1 gap-y-1 my-4">
        {lineChartDataToRender.map(
          (item, index) =>
            item.data && (
              <InfoDisplay
                key={index}
                title={item.title}
                cssOverrideParent="h-[600px]"
                showFullScreen
              >
                <LineChart data={item.data} xAxisKey="name" />
              </InfoDisplay>
            ),
        )}
        {dataTotalExpenses && (
          <OverviewDisplay dataToRender={dataToRender} pieMode={pieMode} />
        )}

        {groupedLineChartDataToRender.map(
          (item, index) =>
            item.data && (
              <InfoDisplay
                key={index}
                title={item.title}
                cssOverrideParent="h-[600px]"
                showFullScreen
              >
                <LineChart data={item.data} xAxisKey="Month & Year" />
              </InfoDisplay>
            ),
        )}
      </div>
    </div>
  )
}
