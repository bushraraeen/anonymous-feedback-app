'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';

export default function MessagePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([
    "What's your favorite hobby?",
    "If you could travel anywhere, where would you go?",
    "What's the best advice you've ever received?"
  ]);

  const handleSendMessage = async () => {
    if (!content) {
      toast.error("Message cannot be empty");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-messages', {
        username,
        content,
      });
      toast.success(response.data.message);
      setContent('');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAISuggestions = async () => {
  setIsSuggesting(true);
  try {
    // FIX: Humesha ek object bhejo, bhale hi content khali ho
    const response = await axios.post('/api/suggest-messages', { 
      userInput: content || "" 
    });
    
    if (response.data && response.data.text) {
      const messagesArray = response.data.text.split('||');
      setSuggestedMessages(messagesArray);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsSuggesting(false);
  }
};
  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded-lg shadow-md max-w-4xl border border-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Public Profile Link</h1>
      
      <div className="space-y-4 mb-12">
        <p className="font-medium text-lg">
          Send Anonymous Message to <span className="text-blue-600 font-bold">@{username}</span>
        </p>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Write something... (e.g. college, friendship, secret)"
            className="h-12 border-gray-300"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !content}
            className="w-full md:w-32 h-11 bg-black text-white"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send It"}
          </Button>
        </div>
      </div>

      <hr className="my-10 border-gray-200" />

      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={fetchAISuggestions}
            disabled={isSuggesting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Suggest Based on My Text
          </Button>
          <p className="text-sm text-gray-500">
            {content ? `Generating ideas about "${content.substring(0,20)}..."` : "Type something for better ideas!"}
          </p>
        </div>

        <Card className="border-dashed border-2">
          <CardHeader><CardTitle className="text-xl">AI Ideas</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            {suggestedMessages.map((message, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left py-4 h-auto whitespace-normal border-gray-200 hover:bg-blue-50"
                onClick={() => setContent(message)}
              >
                {message}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}