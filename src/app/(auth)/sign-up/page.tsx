'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from 'next/link'
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { toast } from "sonner"

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
import { Loader2 } from "lucide-react"

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Debouncing logic: typing rukne ke 500ms baad debouncedUsername update hoga
  const [debouncedUsername] = useDebounceValue(username, 500)
  
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  // Effect for Real-time Username Check
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<any>;
          setUsernameMessage(axiosError.response?.data.message || "Error checking username")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/sign-up', data)
      toast.success(response.data.message)
      router.replace(`/verify/${data.username}`)
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      toast.error(axiosError.response?.data.message || "Signup failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-slate-200 p-4">
      <div className="w-full max-w-lg p-10 space-y-8 bg-white rounded-3xl shadow-2xl border border-white/50">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            Create Account
          </h1>
          <p className="text-slate-500 font-medium">Join us today! It only takes a minute.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="unique_username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // Yeh form state handle karega
                        setUsername(e.target.value); // Yeh debouncing trigger karega
                      }}
                      className="rounded-xl p-6 bg-slate-50 border-slate-200 focus:bg-white transition-all shadow-sm"
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin mt-2 text-indigo-600" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p className={`text-sm mt-2 font-medium ${usernameMessage === 'Username is unique' ? 'text-green-600' : 'text-red-500'}`}>
                       {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-bold">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      {...field} 
                      className="rounded-xl p-6 bg-slate-50 border-slate-200 focus:bg-white transition-all shadow-sm"
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
                  <FormLabel className="text-slate-700 font-bold">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Min 6 characters" 
                      {...field} 
                      className="rounded-xl p-6 bg-slate-50 border-slate-200 focus:bg-white transition-all shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-7 rounded-2xl transition-all shadow-xl mt-4" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-slate-500">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-indigo-600 hover:underline font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}