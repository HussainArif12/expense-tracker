import { useFileSharing } from '#/components/FileSharingContextProvider'
import { InfoDisplay } from '#/components/InfoDisplay'
import { TradingOverviewOneMonthDisplay } from '#/components/TradingOverviewOneMonthDisplay'
import type { MerchantData } from '#/types/MerchantData'
import type { TradingOverview } from '#/types/TradingOverview'
import { mapRecordToChartData } from '#/utils/mapRecordToChartData'
import { postFormClient } from '#/utils/post_form'
import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import React, { useMemo, useState } from 'react'

type ChartDatum = { name: string; value: number; color: string }

export const Route = createFileRoute('/trading_one_month')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setTradingFile, tradingFile } = useFileSharing()
  const [dataTotalExpenses, setDataTotalExpenses] =
    useState<TradingOverview | null>(null)
  const [dataMerchant, setDataMerchant] = useState<MerchantData | null>(null)

  const totalExpensesToRender = useMemo<ChartDatum[] | undefined>(() => {
    return mapRecordToChartData(dataTotalExpenses?.total_expenses)
  }, [dataTotalExpenses])

  const stocksBoughtToRender = useMemo<ChartDatum[] | undefined>(() => {
    return mapRecordToChartData(dataTotalExpenses?.stocks_only)
  }, [dataTotalExpenses])

  const merchantsGroupedToRender = useMemo<ChartDatum[] | undefined>(() => {
    return mapRecordToChartData(dataMerchant?.merchant_data.merchants_grouped)
  }, [dataMerchant])

  const merchantsCategoryGroupedToRender = useMemo<
    ChartDatum[] | undefined
  >(() => {
    return mapRecordToChartData(
      dataMerchant?.merchant_data.merchant_category_grouped,
    )
  }, [dataMerchant])
  const stocksExpense =
    dataTotalExpenses?.stocks_only &&
    Object.values(dataTotalExpenses.stocks_only)

  const stockSum = stocksExpense?.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTradingFile(event.target.files?.[0] ?? null)
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!tradingFile) return

    const formData = new FormData()
    formData.append('csvFile', tradingFile)

    const [totalExpensesResponse, merchantResponse] = await Promise.all([
      postFormClient('/trading_month/total_expenses', formData),
      postFormClient('/trading_month/merchant', formData),
    ])

    setDataTotalExpenses(totalExpensesResponse)
    setDataMerchant(merchantResponse)
  }
  return (
    <ClientOnly>
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
        <div className="grid grid-cols-3 sm:grid-cols-2 w-full gap-x-1 gap-y-1 my-4">
          {dataTotalExpenses && (
            <div className="w-full">
              <InfoDisplay title={'Total Spent this month (including stocks)'}>
                <h1 className="text-9xl text-center ">
                  {dataTotalExpenses.total_expenses_sum}
                </h1>
                {stockSum && (
                  <p className="text-xl text-center">
                    Total without stock:{' '}
                    <span className="font-bold">
                      {' '}
                      {(
                        dataTotalExpenses.total_expenses_sum - stockSum
                      ).toFixed(2)}
                    </span>
                  </p>
                )}
              </InfoDisplay>{' '}
            </div>
          )}
          {dataTotalExpenses && (
            <div className="w-full">
              <InfoDisplay title={'Interest earned'}>
                <h1 className="text-9xl text-center">
                  {dataTotalExpenses.interest_earned.toFixed(2)}
                </h1>
              </InfoDisplay>{' '}
            </div>
          )}
          {dataTotalExpenses && (
            <div className="w-full">
              <InfoDisplay title="Cashback">
                <h1 className="text-9xl text-center">
                  {dataTotalExpenses.cashback.toFixed(2)}
                </h1>
              </InfoDisplay>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 w-full gap-x-1 gap-y-1 my-4">
          <TradingOverviewOneMonthDisplay
            totalExpensesToRender={totalExpensesToRender}
            merchantsCategoryGroupedToRender={merchantsCategoryGroupedToRender}
            merchantsGroupedToRender={merchantsGroupedToRender}
            stocksBoughtToRender={stocksBoughtToRender}
          />
        </div>
      </div>
    </ClientOnly>
  )
}
