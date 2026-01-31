'use client'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { verifySchema } from "@/schemas/verifySchema"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyAccount() {
  const router = useRouter()
  const params = useParams<{ username: string }>()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "123456" // ✅ Testing ke liye default value set kar di
    }
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      // Endpoint ensure karein (pichle code mein aapne api/verify-code likha tha)
      const response = await axios.post(`/api/verify-user`, {
        username: params.username,
        code: data.code
      })

      toast.success(response.data.message || "Verified successfully!")
      router.replace('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<any>
      toast.error(axiosError.response?.data.message || "Verification failed")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950 p-4">
      <Card className="w-full max-w-md shadow-2xl bg-neutral-900 border-white/10 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Verify Your Account</CardTitle>
          <CardDescription className="text-gray-400">
            Enter the 6-digit code sent to your email.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* --- Unique Testing Info Box --- */}
          <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl text-center">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-1">
              Demo Mode
            </p>
            <p className="text-gray-400 text-xs mb-2">
              Email service is currently bypassed. Use:
            </p>
            <div className="text-3xl font-mono font-black text-white tracking-widest">
              123456
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col items-center">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col items-center">
                    <FormLabel className="text-gray-300 mb-2">6-Digit Verification Code</FormLabel>
                    <FormControl>
                      {/* Shadcn InputOTP matching dark theme */}
                      <InputOTP maxLength={6} {...field} className="text-white">
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} className="bg-neutral-800 border-white/20 rounded-md w-12 h-12 text-lg" />
                          <InputOTPSlot index={1} className="bg-neutral-800 border-white/20 rounded-md w-12 h-12 text-lg" />
                          <InputOTPSlot index={2} className="bg-neutral-800 border-white/20 rounded-md w-12 h-12 text-lg" />
                          <InputOTPSlot index={3} className="bg-neutral-800 border-white/20 rounded-md w-12 h-12 text-lg" />
                          <InputOTPSlot index={4} className="bg-neutral-800 border-white/20 rounded-md w-12 h-12 text-lg" />
                          <InputOTPSlot index={5} className="bg-neutral-800 border-white/20 rounded-md w-12 h-12 text-lg" />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 transition-all active:scale-95"
              >
                Verify Now
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}