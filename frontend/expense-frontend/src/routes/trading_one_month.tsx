import { postFormClient } from '#/utils/post_form'
import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'

export const Route = createFileRoute('/trading_one_month')({
  component: RouteComponent,
})

function BackendMaker() {
  const [file, setFile] = useState<File | null>(null)
  const handleFileChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }
  console.log(file)
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (file) {
      const formData = new FormData()
      formData.append('csvFile', file)
      const data = await postFormClient(
        '/trading_month/total_expenses',
        formData,
      )
      console.log(data)
    }
  }
  return (
    <div className="px-10">
      <form onSubmit={(e) => handleSubmit(e)} onChange={handleFileChange}>
        <p>Upload CSV file</p>
        <input
          type="file"
          name="csvFile"
          className="bg-yellow-300 rounded-md p-1"
        />
        <button type="submit" className="bg-blue-300 rounded-md p-1">
          Submit
        </button>
      </form>
    </div>
  )
}

function RouteComponent() {
  return (
    <div>
      Hello "/trading_one_month"!
      <ClientOnly>
        <BackendMaker />
      </ClientOnly>
    </div>
  )
}
