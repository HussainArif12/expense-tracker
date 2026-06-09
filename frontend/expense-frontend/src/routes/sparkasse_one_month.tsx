'use client'
import { useFileSharing } from '#/components/FileSharingContextProvider'
import { InfoDisplay } from '#/components/InfoDisplay'
import { PieChart } from '#/components/PieChart'
import type { ChartDatum } from '#/types/ChartDatum'
import type { FinancialOverview } from '#/types/FinancialOverview'
import { mapRecordToChartData } from '#/utils/mapRecordToChartData'
import { postFormClient } from '#/utils/post_form'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/sparkasse_one_month')({
  component: RouteComponent,
})

function RouteComponent() {
  const [bankOverview, setBankOverview] = useState<FinancialOverview | null>()
  const { setBankingFile, bankingFile } = useFileSharing()

  const totalExpensesToRender = useMemo<ChartDatum[] | undefined>(() => {
    return mapRecordToChartData(bankOverview?.costs_grouped)
  }, [bankOverview])

  const net = useMemo<number | undefined>(() => {
    if (bankOverview)
      return Number((bankOverview.inflow - bankOverview.outflow).toFixed(2))
  }, [bankOverview])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBankingFile(event.target.files?.[0] ?? null)
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!bankingFile) return

    const formData = new FormData()
    formData.append('bank_file', bankingFile)

    const bankOverviewResponse = await postFormClient(
      '/bank_one_month/total_overview',
      formData,
    )

    setBankOverview(bankOverviewResponse)
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
      <div className="grid grid-cols-1 w-full gap-x-1 gap-y-1 my-4 ">
        {bankOverview && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-1 sm:gap-y-1">
            <InfoDisplay title="Outflow">
              <h1 className="text-8xl lg:text-9xl text-center text-red-800">
                {bankOverview.outflow.toFixed(2)}
              </h1>
            </InfoDisplay>
            <InfoDisplay title="Inflow">
              <h1 className="text-8xl lg:text-9xl text-center  text-green-800">
                {bankOverview.inflow.toFixed(2)}
              </h1>
            </InfoDisplay>
            <InfoDisplay title="Net">
              <h1 className="text-8xl lg:text-9xl text-green-800">
                {net && net < 0 ? (
                  <span className="text-red-800">{net}</span>
                ) : (
                  <span className="text-green-800">{net}</span>
                )}
              </h1>
            </InfoDisplay>
          </div>
        )}
        {totalExpensesToRender && (
          <PieChart
            data={totalExpensesToRender}
            title="Outflow grouped by merchant"
          />
        )}
      </div>
    </div>
  )
}
