import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExpandIcon, X } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'

export interface InfoDisplayProps {
  children?: React.ReactNode
  title: string
  cssOverrideParent?: string
  showFullScreen?: boolean
}

export const InfoDisplay: React.FC<InfoDisplayProps> = ({
  children,
  title,
  cssOverrideParent,
  showFullScreen = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div
      className={`flex flex-col h-[220px] w-full rounded-md border-solid border-4 border-pink-300 p-4 overflow-x-auto ${cssOverrideParent}`}
    >
      <div className="w-full bg-blue-300 rounded-md p-1 mb-2 flex items-center justify-between shrink-0">
        <p className="flex-1 text-center bg-blue-300 text-center p-[0.5px] justify-center rounded-md">
          {title}
        </p>
        {showFullScreen && (
          <button
            className="rounded-md bg-pink-400 p-1 cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <ExpandIcon />
          </button>
        )}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full ">
        {children}
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        {/* Darkened Backdrop */}
        <div
          className="fixed inset-0 bg-pink-300/10 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Fullscreen Positioning Container */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 sm:p-8">
          {/* The Actual Modal Panel */}
          <DialogPanel className="w-full h-full max-h-[90vh] max-w-[90vw] rounded-xl border-solid border-8 border-pink-300 bg-white p-4 sm:p-6 flex flex-col shadow-2xl">
            {/* Dialog Header */}
            <div className="w-full bg-blue-300 rounded-md p-2 mb-4 flex items-center justify-between shrink-0">
              <div className="w-16" /> {/* Spacer */}
              <DialogTitle className="flex-1 text-center text-lg md:text-xl m-0">
                {title}
              </DialogTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-pink-400 rounded px-3 py-1 text-sm font-bold  cursor-pointer"
              >
                <X />
              </button>
            </div>

            {/* Dialog Content Container (Allows charts to expand completely) */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full">
              {children}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}
