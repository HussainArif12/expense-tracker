import type React from 'react'

export interface InfoDisplayProps {
  children?: React.ReactNode
  title: string
}

export const InfoDisplay: React.FC<InfoDisplayProps> = ({
  children,
  title,
}) => {
  return (
    <div className="h-[220px] w-full rounded-md border-solid border-4 border-pink-300 p-4 overflow-x-auto">
      <p className="w-full bg-blue-300 text-center p-[0.5px] justify-center">
        {title}
      </p>
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full ">
        {children}
      </div>
    </div>
  )
}
