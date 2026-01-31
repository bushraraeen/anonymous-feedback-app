'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import messages from '@/messages.json'
import Autoplay from "embla-carousel-autoplay"
import { motion } from "framer-motion" // Animations ke liye
import { Mail, ShieldCheck, Zap } from 'lucide-react' // Unique Icons
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white selection:bg-blue-500/30">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-24 py-20 relative overflow-hidden">
        {/* Background Decoration (Unique touch) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent -z-10" />

        {/* Hero Section with Animation */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-blue-400 uppercase bg-blue-400/10 border border-blue-400/20 rounded-full">
            100% Secure & Anonymous
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            True Honesty, <br className="hidden md:block" /> Without the Judgement
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Mystery Message allows you to receive honest feedback from your friends, fans, or coworkers while keeping their identity a total secret.
          </p>
        </motion.section>

        {/* --- Carousel Section with Glow Effect --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full max-w-lg md:max-w-2xl mb-16"
        >
          {/* Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="relative bg-neutral-900 border border-white/10 rounded-xl shadow-2xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-6 md:p-10">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600/20 p-3 rounded-lg">
                        <Mail className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl">{message.title}</h3>
                        <p className="text-gray-300 italic text-lg leading-relaxed">
                          "{message.content}"
                        </p>
                        <p className="text-sm text-gray-500 pt-2 font-mono">
                          — {message.received}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 w-full max-w-5xl">
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-green-400" />} 
            title="Encrypted" 
            desc="Messages are private and securely stored."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-yellow-400" />} 
            title="Fast" 
            desc="Real-time delivery to your dashboard."
          />
          <FeatureCard 
            icon={<Mail className="w-6 h-6 text-purple-400" />} 
            title="Verified" 
            desc="Option to filter messages from verified users."
          />
        </div>

        {/* CTA Button */}
        <Link href="/sign-up">
          <Button className="bg-white text-black hover:bg-gray-200 px-10 py-7 text-lg font-bold rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Create Your Profile Now
          </Button>
        </Link>
      </main>

      <footer className="text-center p-8 bg-neutral-950 border-t border-white/5 text-gray-600">
        <p>© 2024 Mystery Message. Built for creators.</p>
      </footer>
    </div>
  )
}

// Sub-component for features
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
      <div className="mb-4">{icon}</div>
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  )
}