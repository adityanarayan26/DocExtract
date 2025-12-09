'use server'

import { createClient } from '@/utils/supabase/server'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"; // <--- CHANGED THIS
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

export async function processDocument(filePath: string, fileId: string) {
  const supabase = await createClient()

  try {
    // 1. Download the file from Supabase Storage
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from('user-documents')
      .download(filePath)

    if (downloadError || !fileBlob) throw new Error("Failed to download file")

    // 2. Determine Loader based on file extension
    let text = ""
    
    if (filePath.endsWith('.pdf')) {
    
      const loader = new PDFLoader(fileBlob);
      const docs = await loader.load();
      text = docs.map(d => d.pageContent).join('\n\n'); 
    } 
    else if (filePath.endsWith('.docx')) {
      const loader = new DocxLoader(fileBlob);
      const docs = await loader.load();
      text = docs.map(d => d.pageContent).join('\n\n');
    }

    // 3. Update the Database with the text
    const { error: updateError } = await supabase
      .from('documents')
      .update({ extracted_text: text })
      .eq('id', fileId)

    if (updateError) throw new Error("Failed to save text to DB")

    return { success: true }

  } catch (error: any) {
    console.error("Extraction Error:", error)
    return { success: false, error: error.message }
  }
}