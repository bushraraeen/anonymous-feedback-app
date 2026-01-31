'use client'

import React from 'react'
import axios, { AxiosError } from 'axios'
import { Trash2 } from 'lucide-react' // Delete icon ke liye
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { toast } from 'sonner' // Ya useToast agar aap shadcn use kar rahe hain
import { Message } from '@/app/model/User'
import { ApiResponse } from '@/types/ApiResponse'

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void; // Parent (Dashboard) ko batane ke liye
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  
  const handleDeleteConfirm = async () => {
   try {
    // MongoDB ki ID ko string mein convert kar rahe hain bina 'as string' use kiye
   const messageId = message._id.toString();

// URL mein check karein ki koi extra space ya typo toh nahi
const response = await axios.delete(`/api/delete-message/${messageId}`);
    
    toast.success(response.data.message || "Message deleted");
    
    // Yahan bhi ab clean call hogi
    onMessageDelete(messageId);
    
  } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message || "Failed to delete message"
      )
    }
  }

  return (
    <Card className="bg-neutral-900 border-white/10 text-white relative group overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between p-4">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-gray-400">
            Received Message
          </CardTitle>
        </div>

        {/* --- Delete Button with Alert Dialog --- */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-neutral-900 border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Message?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete this message? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-neutral-800 border-white/10 text-white hover:bg-neutral-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="text-lg font-medium text-gray-100 mb-2">
          {message.content}
        </p>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">
          {new Date(message.createdAt).toLocaleString()}
        </span>
      </CardContent>
    </Card>
  )
}