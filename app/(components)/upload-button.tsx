'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { UploadCloud, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { processDocument } from '@/app/actions/process-document' // Import your server action

export default function UploadButton() {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. VALIDATION
    // Check Size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Max 10MB allowed.")
      return
    }
    // Check Type
    const allowedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF and DOCX files are allowed.")
      return
    }

    setIsUploading(true)

    try {
      // 2. Get User
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Please log in first")

      // 3. Upload to Supabase Storage
      const filePath = `${user.id}/${Date.now()}_${file.name}`
      
      const { error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 4. Create Database Record
      const { data: dbData, error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          original_filename: file.name,
          file_path: filePath,
          extracted_text: null, 
          uploaded_at: new Date().toISOString(),
        })
        .select() // IMPORTANT: We need the ID back!
        .single()

      if (dbError) throw dbError

      // 5. TRIGGER TEXT EXTRACTION (Server Action)
      // "Fire and Forget": We start this but don't wait for it to finish 
      // so the user sees the success message immediately.
      processDocument(filePath, dbData.id).then((result) => {
        if (result.success) {
           console.log("Text extracted successfully")
           router.refresh() // Refreshes the UI to show "Ready" status
        } else {
           console.error("Extraction failed:", result.error)
        }
      })

      // 6. UI Feedback
      alert("Upload successful! Processing text in background...")
      router.refresh()
      
    } catch (error: any) {
      console.error(error)
      alert("Upload failed: " + error.message)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.docx"
      />

      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload Document
          </>
        )}
      </button>
    </div>
  )
}