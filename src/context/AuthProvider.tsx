'use client'
import { SessionProvider } from "next-auth/react"

// 'default' hona zaroori hai
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}