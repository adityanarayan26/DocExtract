import { FileText, UploadCloud, Search, Eye, Grid, ListFilter } from "lucide-react";
import { Document } from "@/types";
import UploadButton from '../(components)/upload-button'; 
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// --- COMPONENTS ---
import ViewTextModal from "../(components)/view-text-modal";
import DeleteDocumentButton from "../(components)/delete-document-button";
import DownloadButton from "../(components)/download-button"; 
import UserDropdown from "../(components)/user-dropdown"; 

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const { data: documentsData, error: docsError } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .order('uploaded_at', { ascending: false });

  const documents = (documentsData as Document[]) || [];

  return (
    // Removed DashboardAnimator wrapper to fix potential crashes
    <div className="min-h-screen bg-[#F8F9FC] pb-20"> 
      
      {/* --- TOP NAVIGATION --- */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-zinc-200/80 bg-white/80 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 font-bold tracking-tight text-zinc-900">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <FileText size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg">DocExtract</span>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <UserDropdown email={user.email} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6 md:p-10 space-y-10">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">My Documents</h1>
            <p className="text-zinc-500 font-medium">Manage and process your text files securely.</p>
          </div>
          <div className="flex items-center gap-3">
            <UploadButton />
          </div>
        </div>

        {/* --- STATS OVERVIEW --- */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard 
            title="Total Documents" 
            value={documents.length.toString()} 
            icon={<Grid className="h-5 w-5 text-indigo-600" />}
            bg="bg-indigo-50"
          />
          <StatsCard 
            title="Processed Successfully" 
            value={documents.filter(d => d.extracted_text).length.toString()} 
            icon={<Eye className="h-5 w-5 text-emerald-600" />} 
            bg="bg-emerald-50"
          />
          <StatsCard 
            title="Processing Pending" 
            value={documents.filter(d => !d.extracted_text).length.toString()} 
            icon={<UploadCloud className="h-5 w-5 text-amber-600" />} 
            bg="bg-amber-50"
          />
        </div>

        {/* --- MAIN TABLE --- */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <ListFilter className="h-4 w-4" />
              Recent Uploads
            </div>
          </div>

          <div className="relative w-full overflow-auto">
            {documents.length === 0 ? (
              <EmptyState />
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50/50 text-xs uppercase font-semibold text-zinc-500 tracking-wider">
                  <tr>
                    <th className="h-12 px-6 align-middle">Document Name</th>
                    <th className="h-12 px-6 align-middle">Status</th>
                    <th className="h-12 px-6 align-middle hidden md:table-cell">Uploaded</th>
                    <th className="h-12 px-6 align-middle text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="group transition-colors hover:bg-zinc-50/80">
                      <td className="p-6 align-middle">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${doc.original_filename.endsWith('pdf') ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                            <FileText size={24} />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-zinc-900 truncate max-w-[240px]">
                              {doc.original_filename}
                            </span>
                            <span className="text-[11px] text-zinc-400 uppercase tracking-wide">
                              {doc.original_filename.split('.').pop()} FILE
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        {doc.extracted_text ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/10">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Processing
                          </span>
                        )}
                      </td>
                      <td className="p-6 align-middle text-zinc-500 font-medium hidden md:table-cell">
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </td>
                      <td className="p-6 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          {doc.extracted_text && (
                            <ViewTextModal text={doc.extracted_text} fileName={doc.original_filename} />
                          )}
                          <DownloadButton filePath={doc.file_path} fileName={doc.original_filename} />
                          <DeleteDocumentButton fileId={doc.id} filePath={doc.file_path} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Helper Components ---
function StatsCard({ title, value, icon, bg }: { title: string, value: string, icon: React.ReactNode, bg: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <div className="mt-2 text-3xl font-bold text-zinc-900 tracking-tight">{value}</div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 ring-1 ring-zinc-100">
        <UploadCloud className="h-8 w-8 text-zinc-300" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900">No documents yet</h3>
      <p className="max-w-sm mt-2 text-sm text-zinc-500">
        Upload your first PDF or DOCX file.
      </p>
    </div>
  )
}