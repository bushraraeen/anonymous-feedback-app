'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { signIn } from 'next-auth/react'
import { signInSchema } from '@/schemas/signInSchema'
import { useRouter } from "next/navigation"
import { toast } from "sonner" // ✅ Sonner use kar rahe hain
import { useState } from "react"
import Link from "next/link"

// Shadcn UI Imports
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // 1. Form Initialization
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  // 2. Submit Handler
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })

    if (result?.error) {
      setIsSubmitting(false)
      // Custom error messages
      if (result.error === 'CredentialsSignin') {
        toast.error("Login Failed! Check your email/password")
      } else {
        toast.error(result.error)
      }
    }

    if (result?.url) {
      setIsSubmitting(false)
      toast.success("Signed in successfully!")
      router.replace('/dashboard')
    }
  }

 return (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-4">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 mb-4">
          Welcome Back
        </h1>
        <p className="text-slate-500 font-medium mb-6">Enter your details to access your dashboard</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">Email/Username</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter email or username" 
                    {...field} 
                    className="rounded-xl border-gray-200 p-6 focus:ring-2 focus:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    className="rounded-xl border-gray-200 p-6 focus:ring-2 focus:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 rounded-xl transition-all shadow-lg hover:shadow-indigo-200"
          >
            Sign In
          </Button>
        </form>
      </Form>

      <div className="text-center mt-6">
        <p className="text-slate-600">
          Not a member?{' '}
          <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-800 font-bold underline underline-offset-4">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  </div>
);
}