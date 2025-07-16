"use client"

import { Phone, Home, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 text-center">
        <h1 className="text-2xl font-bold text-purple-800 mb-2">Thanks to Me</h1>
        <p className="text-purple-600 text-lg font-medium">Hi, 지선! 👋</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        {/* AI Character Avatar */}
        <div className="relative mb-8">
          <div className="w-48 h-48 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <div className="w-40 h-40 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center">
              {/* Cute AI Character Face */}
              <div className="relative">
                {/* Eyes */}
                <div className="flex space-x-4 mb-3">
                  <div className="w-4 h-4 bg-purple-800 rounded-full"></div>
                  <div className="w-4 h-4 bg-purple-800 rounded-full"></div>
                </div>
                {/* Smile */}
                <div className="w-8 h-4 border-b-3 border-purple-800 rounded-full mx-auto"></div>
                {/* Blush */}
                <div className="absolute -left-6 top-2 w-3 h-3 bg-pink-400 rounded-full opacity-60"></div>
                <div className="absolute -right-6 top-2 w-3 h-3 bg-pink-400 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
          {/* Floating hearts */}
          <div className="absolute -top-2 -right-2 text-pink-400 text-xl animate-pulse">💜</div>
          <div className="absolute -bottom-2 -left-2 text-purple-400 text-lg animate-pulse delay-500">✨</div>
        </div>

        {/* Greeting Message */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl px-6 py-4 mb-8 shadow-sm border border-purple-100">
          <p className="text-purple-700 text-center font-medium">Ready to share what's on your heart today?</p>
        </div>

        {/* Call Button */}
        <Link href="/chat">
          <Button
            className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 shadow-xl border-4 border-white transition-all duration-300 hover:scale-105 active:scale-95"
            size="lg"
          >
            <Phone className="w-12 h-12 text-white" />
          </Button>
        </Link>

        <p className="text-purple-600 mt-4 font-medium">Tap to start talking</p>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-100 px-6 py-4">
        <div className="flex justify-around items-center max-w-sm mx-auto">
          <button className="flex flex-col items-center space-y-1 p-2 rounded-2xl bg-purple-100 text-purple-600">
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <Link href="/history">
            <button className="flex flex-col items-center space-y-1 p-2 rounded-2xl text-purple-400 hover:bg-purple-50 transition-colors">
              <Clock className="w-6 h-6" />
              <span className="text-xs font-medium">History</span>
            </button>
          </Link>
        </div>
      </nav>
    </div>
  )
}
