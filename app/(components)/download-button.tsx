'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function DownloadButton({ filePath, fileName }: { filePath: string, fileName: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.storage
        .from('user-documents')
        .download(filePath)

      if (error) throw error

      // Create a blob url and trigger download
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download file.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDownload}
      disabled={isLoading}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
      title="Download Original"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
    </button>
  )
}