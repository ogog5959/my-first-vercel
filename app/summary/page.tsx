"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Star } from "lucide-react"
import Link from "next/link"
import { llmService, Message as LLMMessage } from "@/lib/llm-service"

export default function SummaryPage() {
  const [gratitudePoints, setGratitudePoints] = useState<string[]>([])
  const [advice, setAdvice] = useState<{ discovery: string; suggestion: string; encouragement: string } | null>(null)
  const [overallMood, setOverallMood] = useState<string>('긍정적')
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
      
      // 전체 분위기 분석 (간단하게)
      const userMessages = history.filter(msg => msg.role === 'user')
      const positiveWords = ['좋', '감사', '행복', '기쁘', '만족', '즐거', '평화', '희망']
      const negativeWords = ['힘들', '어렵', '스트레스', '불안', '걱정', '화나', '슬프']
      
      let positiveCount = 0
      let negativeCount = 0
      
      userMessages.forEach(msg => {
        positiveWords.forEach(word => {
          if (msg.content.includes(word)) positiveCount++
        })
        negativeWords.forEach(word => {
          if (msg.content.includes(word)) negativeCount++
        })
      })
      
      if (positiveCount > negativeCount) {
        setOverallMood('긍정적')
      } else if (negativeCount > positiveCount) {
        setOverallMood('부정적')
      } else {
        setOverallMood('중립적')
      }
      
      setLoading(false)
    }
    fetchSummary()
  }, [])

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case '긍정적': return 'bg-green-100 text-green-800'
      case '부정적': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">오늘의 감사를 분석하고 있어요...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-purple-800">오늘의 감사 요약</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 전체 분위기 */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <Heart className="w-5 h-5 mr-2 text-pink-500" />
              오늘의 전체 분위기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Badge className={`text-lg px-4 py-2 ${getMoodColor(overallMood)}`}>
                {overallMood}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 감사 포인트 */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              오늘의 감사 포인트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gratitudePoints.map((point, index) => (
                <div key={index} className="border border-purple-100 rounded-lg p-4 bg-white/50">
                  <p className="text-gray-800">{point}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 격려 메시지 */}
        {advice && (
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <Heart className="w-5 h-5 mr-2 text-pink-500" />
                오늘의 발견
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-lg">{advice.discovery}</p>
            </CardContent>
          </Card>
        )}

        {/* 액션 버튼 */}
        <div className="mt-8 text-center">
          <Link href="/chat">
            <Button className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500">
              새로운 대화 시작하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
