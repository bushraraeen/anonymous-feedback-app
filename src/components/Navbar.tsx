'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { User } from 'next-auth'
import { LogOut, User as UserIcon, MessageSquare } from 'lucide-react'

function Navbar() {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950/75 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center p-4 md:px-8">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <MessageSquare className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-extrabold tracking-tighter text-white">
            MYSTERY<span className="text-blue-500">.</span>
          </span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <UserIcon className="w-4 h-4 text-blue-400" />
                {user.username || user.email}
              </div>
              
              <Button 
                onClick={() => signOut()} 
                variant="ghost"
                className="text-white hover:bg-red-500/10 hover:text-red-500 gap-2 border border-white/5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all active:scale-95">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar