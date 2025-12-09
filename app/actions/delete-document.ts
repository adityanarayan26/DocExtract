'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteDocument(fileId: string, filePath: string) {
  const supabase = await createClient()

  try {
    // 1. Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('user-documents')
      .remove([filePath])

    if (storageError) {
      console.error("Storage delete error:", storageError)
      throw new Error("Failed to delete file from storage")
    }

    // 2. Delete from Database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', fileId)

    if (dbError) {
      console.error("DB delete error:", dbError)
      throw new Error("Failed to delete record from database")
    }

    // 3. Refresh the Dashboard
    revalidatePath('/dashboard')
    return { success: true }

  } catch (error: any) {
    return { success: false, error: error.message }
  }
}