"use client"

import { Heart, Home, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { llmService, Message as LLMMessage } from "@/lib/llm-service"

export default function SummaryPage() {
  const [gratitudePoints, setGratitudePoints] = useState<string[]>([])
  const [advice, setAdvice] = useState<{ discovery: string; suggestion: string; encouragement: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true)
      let history: LLMMessage[] = []
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('thanksToMe_conversationHistory')
        if (raw) {
          history = JSON.parse(raw)
        }
      }
      if (history.length === 0) {
        setLoading(false)
        return
      }
      // 요약 요청
      const summary = await llmService.summarizeConversation(history)
      setGratitudePoints(summary.points)
      // 조언 요청
      const adviceRes = await llmService.generateAdvice(summary.points)
      setAdvice(adviceRes)
      setLoading(false)
    }
    fetchSummary()
  }, [])

  const emotionTag = {
    emoji: "😊",
    label: "Warm",
    color: "from-orange-200 to-pink-200",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Heart className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-purple-800 mb-2">Session Complete</h1>
        <p className="text-purple-600">Here's what we discovered together</p>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-24 space-y-8">
        {/* Emotion Tag */}
        <div className="flex justify-center">
          <div
            className={`bg-gradient-to-r ${emotionTag.color} px-6 py-3 rounded-full shadow-sm border border-white/50`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{emotionTag.emoji}</span>
              <span className="font-semibold text-orange-800 text-lg">{emotionTag.label}</span>
            </div>
          </div>
        </div>

        {/* Gratitude Points */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-purple-100">
          <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
            <span className="text-xl mr-2">🙏</span>
            Things to be grateful for
          </h2>
          {loading ? (
            <p className="text-purple-500">요약을 생성 중입니다...</p>
          ) : (
            <ul className="space-y-4">
              {gratitudePoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-purple-700 leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Uplifting Message (Advice) */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 text-center shadow-sm border border-white/50">
          {loading ? (
            <p className="text-purple-500">조언을 생성 중입니다...</p>
          ) : advice ? (
            <>
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-purple-800 mb-2">{advice.discovery}</h3>
              <p className="text-purple-600 leading-relaxed mb-2">{advice.suggestion}</p>
              <p className="text-purple-700 font-semibold mt-4">{advice.encouragement}</p>
            </>
          ) : null}
        </div>

        {/* Stats Card (Optional: 대화 길이 등) */}
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-100 px-6 py-6">
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl py-3 font-medium shadow-sm">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/chat" className="block">
            <Button
              variant="outline"
              className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 rounded-2xl py-3 font-medium bg-transparent"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Start Another Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
