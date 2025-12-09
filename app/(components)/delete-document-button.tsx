'use client'

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { deleteDocument } from "@/app/actions/delete-document"
import { useRouter } from "next/navigation"

interface DeleteProps {
  fileId: string
  filePath: string
}

export default function DeleteDocumentButton({ fileId, filePath }: DeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this document?")
    if (!confirmed) return

    setIsDeleting(true)
    
    const result = await deleteDocument(fileId, filePath)
    
    if (!result.success) {
      alert("Failed to delete: " + result.error)
      setIsDeleting(false)
    } else {
      // Optional: fast UI update
      router.refresh()
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
      title="Delete Document"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  )
}