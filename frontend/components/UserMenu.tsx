"use client"

import { useState } from "react"
import { logout } from "@/app/actions/logout"
import { LogOut } from "lucide-react"

export default function UserMenu({ email }: { email: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="cursor-pointer px-2 py-1">
        {email}
      </div>
      
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 bg-white border rounded shadow-lg min-w-full">
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
