// src/types.ts (or just types.ts in root)

export interface Document {
  id: string;                 
  user_id: string;
  file_path: string;
  original_filename: string;
  
  // Method A: "It definitely exists, but might be empty" (MATCHES DATABASES)
  extracted_text: string | null; 
  
  uploaded_at: string;        
}