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
    <div className="h-[210px] w-full rounded-md border-solid border-4 border-pink-300 p-4">
      <p className="w-full bg-blue-300 text-center p-[0.5px]">{title}</p>
      <div className="flex-1">{children}</div>
    </div>
  )
}
