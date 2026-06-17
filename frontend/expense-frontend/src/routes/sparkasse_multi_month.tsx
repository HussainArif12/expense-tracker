import { InfoDisplay } from '#/components/InfoDisplay'
import { LineChart } from '#/components/LineChart'
import type { FinancialMultiMonthOverview } from '#/types/FinancialMultiMonthOverview'
import type { MerchantGroupedSparkasse } from '#/types/MerchantGroupedSparkasse'
import { mapRecordToChartData } from '#/utils/mapRecordToChartData'
import { postFormClient } from '#/utils/post_form'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/sparkasse_multi_month')({
  component: RouteComponent,
})

function RouteComponent() {
  const [multiMonthOverview, setMultiMonthOverview] = useState<
    FinancialMultiMonthOverview | undefined
  >()
  const [merchantOverview, setMerchantOverview] =
    useState<MerchantGroupedSparkasse>()
  const [bankingFile, setBankingFile] = useState<File | null>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const net = multiMonthOverview
    ? multiMonthOverview.inflow_total - multiMonthOverview.outflow_total
    : 0
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBankingFile(event.target.files?.[0] ?? null)
  }

  const outflowToChart = useMemo(() => {
    if (!multiMonthOverview) return
    return mapRecordToChartData(multiMonthOverview.outflow_grouped)
  }, [multiMonthOverview])

  const inflowToChart = useMemo(() => {
    if (!multiMonthOverview) return
    return mapRecordToChartData(multiMonthOverview.inflow_grouped)
  }, [multiMonthOverview])

  const mergedInflowOutflowData = useMemo(() => {
    if (!inflowToChart || !outflowToChart) return undefined
    return inflowToChart.map((item, index) => ({
      inflow: item.value,
      outflow: outflowToChart[index].value,
      name: item.name,
    }))
  }, [inflowToChart, outflowToChart])

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!bankingFile) return
    setIsLoading(true)
    const formData = new FormData()
    formData.append('bank_file', bankingFile)
    try {
      const [bankOverviewResponse, merchantOverviewResponse] =
        await Promise.all([
          postFormClient('/bank_multi_month/total_overview', formData),
          postFormClient('/bank_multi_month/merchant_overview', formData),
        ])

      setMerchantOverview(merchantOverviewResponse)
      setMultiMonthOverview(bankOverviewResponse)
    } catch (e) {
      setIsError(true)
    }
    setIsLoading(false)
  }

  return (
    <div className="px-10">
      {bankingFile && (
        <p>
          Uploaded: {bankingFile.name}. Click on{' '}
          <span className="font-bold">Upload</span> to upload it
        </p>
      )}
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
          disabled={!bankingFile}
          className="bg-blue-300 rounded-md p-1 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          Submit
        </button>
      </form>
      {isLoading && <p className="text-blue-800">Loading..</p>}
      {isError && (
        <p className="text-pink-800">
          Error! Contact the developer for details
        </p>
      )}
      <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-x-1 gap-y-1 my-4 ">
        {multiMonthOverview && (
          <>
            <InfoDisplay title="Outflow">
              <h1 className="text-8xl lg:text-9xl text-center text-red-800">
                {multiMonthOverview.outflow_total.toFixed(2)}
              </h1>
            </InfoDisplay>
            <InfoDisplay title="Inflow">
              <h1 className="text-8xl lg:text-9xl text-center  text-green-800">
                {multiMonthOverview.inflow_total.toFixed(2)}
              </h1>
            </InfoDisplay>
            <InfoDisplay title="Net">
              <h1 className="text-8xl lg:text-9xl text-green-800">
                {net && (
                  <span className={net < 0 ? 'text-red-800' : 'text-green-800'}>
                    {net.toFixed(2)}
                  </span>
                )}
              </h1>
            </InfoDisplay>
            <InfoDisplay title="Savings rate">
              <h1 className="text-8xl lg:text-9xl">
                {net && (
                  <span className={net < 0 ? 'text-red-800' : 'text-green-800'}>
                    {((net / multiMonthOverview.inflow_total) * 100).toFixed(2)}
                    %
                  </span>
                )}
              </h1>
            </InfoDisplay>
          </>
        )}
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-x-1 gap-y-1 my-4">
        {mergedInflowOutflowData && (
          <InfoDisplay
            title="Total expenses by time period (MM-YY)"
            cssOverrideParent="h-[600px]"
            showFullScreen
          >
            <LineChart data={mergedInflowOutflowData} xAxisKey="name" />
          </InfoDisplay>
        )}
        {merchantOverview && (
          <InfoDisplay
            title="Merchant expenses by time period (MM-YY)"
            cssOverrideParent="h-[600px]"
            showFullScreen
          >
            <LineChart
              data={merchantOverview.outflow_grouped}
              xAxisKey="Month & Year"
            />
          </InfoDisplay>
        )}
      </div>
    </div>
  )
}
