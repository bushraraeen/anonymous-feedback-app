'use client';

import React, { useCallback, useEffect, useState } from 'react';
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/app/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { Loader2, RefreshCcw, Link as LinkIcon, Inbox, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  
  // AI States
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false
    }
  });

  const { setValue, watch } = form;
  const acceptMessages = watch('acceptMessages');

 

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      // NOTE: Status check ke liye hum GET request use karte hain
      const response = await axios.get('/api/accept-messages');
      setValue('acceptMessages', !!response.data.isAcceptingMessages);
    } catch (error) {
      console.error("Error fetching status", error);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) toast.success('Inbox refreshed');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center h-screen italic text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading Dashboard...
      </div>
    );
  }

  const { username } = session.user;
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
       
        <div className="bg-slate-900 p-8 text-white">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">User Dashboard</h1>
          <p className="mt-2 text-slate-400">Manage your profile and anonymous feedback</p>
        </div>

        <div className="p-8 space-y-10">
          
       
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
              <LinkIcon size={16} className="text-indigo-600" /> Your Unique Profile Link
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={profileUrl}
                readOnly
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm text-gray-600"
              />
              <Button onClick={copyToClipboard} className="bg-indigo-600 hover:bg-indigo-700 font-bold px-8 rounded-xl">
                Copy Link
              </Button>
            </div>
          </div>

        
          <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
  acceptMessages 
    ? 'bg-slate-900 border-slate-800 shadow-lg' 
    : 'bg-white border-gray-200 shadow-sm'      
}`}>
           {/* --- Toggle Section Fix --- */}
<div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all">
  <div className="flex items-center gap-4">
    {/* Switch with explicit borders and visible off-state */}
    <Switch
      checked={acceptMessages}
      onCheckedChange={handleSwitchChange}
      disabled={isSwitchLoading}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-colors
        ${acceptMessages ? 'bg-indigo-600 border-transparent' : 'bg-gray-200 border-gray-300'}
      `}
    />
    
    <span className="font-semibold text-gray-800 flex items-center gap-2">
      Accept Messages: 
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        acceptMessages 
          ? 'bg-green-100 text-green-700 border border-green-200' 
          : 'bg-red-50 text-red-600 border border-red-100'
      }`}>
        {acceptMessages ? 'Active' : 'Paused'}
      </span>
    </span>
  </div>
</div>

       

           
              
              
            </div>
          </div>

          <Separator />

       
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Inbox className="text-indigo-600" /> Recent Messages</h2>
              <Button variant="outline" size="sm" onClick={() => fetchMessages(true)} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageCard
                    key={String(message._id)}
                    message={message}
                    onMessageDelete={(id) => setMessages(messages.filter((m) => String(m._id) !== id))}
                  />
                ))
              ) : (
                <div className="col-span-full py-16 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 italic">
                  No messages to display yet.
                </div>
              )}
            </div>
          </div>
           </div>
            </div>

       
  
  );
}