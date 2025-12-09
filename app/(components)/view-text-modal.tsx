'use client'

import { useState, useEffect } from "react"
import { Eye, X, Copy, Check } from "lucide-react"

interface ViewTextModalProps {
  text: string
  fileName: string
}

export default function ViewTextModal({ text, fileName }: ViewTextModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <>
      {/* 1. The Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        title="View Extracted Text"
      >
        <Eye className="h-4 w-4" />
      </button>

      {/* 2. The Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-2xl ring-1 ring-gray-200">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900">Extracted Content</h3>
                <p className="text-sm text-gray-500 max-w-md truncate">{fileName}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Text Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
              <div className="rounded-lg border bg-white p-6 text-sm leading-relaxed text-gray-700 shadow-sm font-mono whitespace-pre-wrap">
                {text || "No text content found."}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t bg-gray-50/50 px-6 py-4">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {isCopied ? "Copied!" : "Copy Text"}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}