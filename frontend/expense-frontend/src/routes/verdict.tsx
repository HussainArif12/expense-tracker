import { useFileSharing } from '#/components/FileSharingContextProvider'
import StackedBarChart from '#/components/StackedBarChart'
import type { FinancialVerdict } from '#/types/FinancialVerdict'
import { postFormClient } from '#/utils/post_form'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/verdict')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setTradingFile, bankingFile, setBankingFile, tradingFile } =
    useFileSharing()

  const [outcome, setOutcome] = useState<FinancialVerdict | null>()

  const outcomeToRender = useMemo(() => {
    if (!outcome) return
    const chartData = [
      {
        name: 'Inflow',
        'Bank Inflow':
          outcome.outcome.find((i) => i.bank_inflow)?.bank_inflow || 0,
        'Trading Inflow': 0, // Hardcoded or dynamic fallback if needed later
      },
      {
        name: 'Outflow',
        'Bank Outflow':
          outcome.outcome.find((i) => i.bank_outflow)?.bank_outflow || 0,
        'Trading Outflow':
          outcome.outcome.find((i) => i.trading_outflow)?.trading_outflow || 0,
      },
    ]
    return chartData
  }, [outcome])
  const handleTradingFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTradingFile(event.target.files?.[0] ?? null)
  }

  const handleBankingFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBankingFile(event.target.files?.[0] ?? null)
  }
  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!tradingFile && !bankingFile) return

    const formData = new FormData()
    bankingFile && formData.append('bank_file', bankingFile)
    tradingFile && formData.append('trading_file', tradingFile)

    const responseData = await postFormClient('/verdict/get_verdict', formData)
    setOutcome(responseData)
  }
  return (
    <div className="px-10">
      {tradingFile && <p>Trading file {tradingFile.name} uploaded</p>}
      {bankingFile && <p>Banking file {bankingFile.name} uploaded</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          htmlFor="trading_file"
          className="block text-sm font-medium text-slate-700"
        >
          Upload T212 statement
        </label>
        <input
          id="trading_file"
          type="file"
          accept=".csv"
          onChange={handleTradingFileChange}
          className="bg-yellow-300 rounded-md p-1"
        />

        <label
          htmlFor="banking_file"
          className="block text-sm font-medium text-slate-700"
        >
          Upload Bank statement
        </label>
        <input
          id="banking_file"
          type="file"
          accept=".csv"
          onChange={handleBankingFileChange}
          className="bg-yellow-300 rounded-md p-1"
        />
        <button
          type="submit"
          disabled={!(tradingFile || bankingFile)}
          className="bg-blue-300 rounded-md p-1 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          Submit
        </button>
      </form>
      <div className="grid grid-cols-1 w-full gap-x-1 gap-y-1 my-4">
        {/* @ts-ignore I cannot figure out the correct type */}
        {outcomeToRender && <StackedBarChart data={outcomeToRender} />}
      </div>
    </div>
  )
}
