'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function UserDropdown({ email }: { email: string | undefined }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white pl-2 pr-4 py-1.5 transition-all hover:bg-zinc-50"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
           {email?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-zinc-700 max-w-[100px] truncate hidden md:block">{email}</span>
        <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-zinc-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-2 border-b border-zinc-100 px-3 py-2">
               <p className="text-xs font-medium text-zinc-500">Signed in as</p>
               <p className="truncate text-sm font-semibold text-zinc-900">{email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}