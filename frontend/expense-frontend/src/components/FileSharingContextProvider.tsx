import { createContext, useContext, useState } from 'react'

interface FileSharingContextValue {
  tradingFile: File | null
  bankingFile: File | null
  setTradingFile: (file: File | null) => void
  setBankingFile: (file: File | null) => void
}

type FileSharingContextProviderProps = React.PropsWithChildren<{}>

const FileSharingContext = createContext<FileSharingContextValue | undefined>(
  undefined,
)

export function FileSharingContextProvider({
  children,
}: FileSharingContextProviderProps) {
  const [tradingFile, setTradingFile] = useState<File | null>(null)
  const [bankingFile, setBankingFile] = useState<File | null>(null)

  return (
    <FileSharingContext.Provider
      value={{ tradingFile, bankingFile, setTradingFile, setBankingFile }}
    >
      {children}
    </FileSharingContext.Provider>
  )
}

export function useFileSharing() {
  const context = useContext(FileSharingContext)
  if (!context) {
    throw new Error(
      'useFileSharing must be used within a FileSharingContextProvider',
    )
  }
  return context
}
