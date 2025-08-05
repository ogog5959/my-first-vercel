"use client"

import { ChevronLeft, ChevronRight, Home, Calendar, Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface JournalEntry {
  date: string
  overallMood: string
  gratitudePoints: string[]
  discovery: string
  sessionTime: string
  conversationCount: number
}

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [journalData, setJournalData] = useState<Record<string, JournalEntry>>({})

  // 로컬스토리지에서 히스토리 데이터 로드
  useEffect(() => {
    const loadHistory = () => {
      if (typeof window !== 'undefined') {
        const historyData = localStorage.getItem('thanksToMe_history')
        if (historyData) {
          setJournalData(JSON.parse(historyData))
        }
      }
    }
    loadHistory()
  }, [])

  // 오늘 날짜 문자열 생성
  const getTodayString = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // 날짜별 대화 기록 저장 (하루에 한 번만)
  const saveTodaySession = async () => {
    const today = getTodayString()
    
    // 이미 오늘 기록이 있으면 저장하지 않음
    if (journalData[today]) {
      return
    }

    // 대화 히스토리 가져오기
    const conversationHistory = localStorage.getItem('thanksToMe_conversationHistory')
    if (!conversationHistory) {
      return
    }

    const history = JSON.parse(conversationHistory)
    if (history.length === 0) {
      return
    }

    try {
      // LLM 서비스로 요약 및 조언 생성
      const { llmService } = await import('@/lib/llm-service')
      
      const summary = await llmService.summarizeConversation(history)
      const advice = await llmService.generateAdvice(summary.points)
      
      // 전체 분위기 분석
      const userMessages = history.filter((msg: any) => msg.role === 'user')
      const positiveWords = ['좋', '감사', '행복', '기쁘', '만족', '즐거', '평화', '희망']
      const negativeWords = ['힘들', '어렵', '스트레스', '불안', '걱정', '화나', '슬프']
      
      let positiveCount = 0
      let negativeCount = 0
      
      userMessages.forEach((msg: any) => {
        positiveWords.forEach(word => {
          if (msg.content.includes(word)) positiveCount++
        })
        negativeWords.forEach(word => {
          if (msg.content.includes(word)) negativeCount++
        })
      })
      
      let overallMood = '중립적'
      if (positiveCount > negativeCount) {
        overallMood = '긍정적'
      } else if (negativeCount > positiveCount) {
        overallMood = '부정적'
      }

      // 세션 시간 계산
      const firstMessage = history[0]
      const lastMessage = history[history.length - 1]
      const sessionTime = firstMessage && lastMessage ? 
        `${new Date(firstMessage.timestamp || Date.now()).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}` : 
        new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

      const newEntry: JournalEntry = {
        date: today,
        overallMood,
        gratitudePoints: summary.points,
        discovery: advice.discovery,
        sessionTime,
        conversationCount: history.length
      }

      // 로컬스토리지에 저장
      const updatedData = { ...journalData, [today]: newEntry }
      localStorage.setItem('thanksToMe_history', JSON.stringify(updatedData))
      setJournalData(updatedData)
      
      // 오늘 날짜 선택
      setSelectedDate(today)
    } catch (error) {
      console.error('세션 저장 실패:', error)
    }
  }

  // 컴포넌트 마운트 시 오늘 세션 저장 시도
  useEffect(() => {
    saveTodaySession()
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      days.push({
        day,
        dateString,
        hasEntry: !!journalData[dateString],
      })
    }

    return days
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("ko-KR", { month: "long", year: "numeric" })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
    setSelectedDate(null)
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case '긍정적': return 'bg-green-100 text-green-800'
      case '부정적': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const days = getDaysInMonth(currentMonth)
  const selectedEntry = selectedDate ? journalData[selectedDate] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-purple-800">나의 감사 여정</h1>
            <p className="text-purple-600">매일의 소중한 순간들을 돌아보세요</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </header>

      {/* Calendar */}
      <main className="px-6 pb-32">
        <Card className="mb-6 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-purple-800">감사 일기 캘린더</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="text-purple-600 hover:bg-purple-50 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold text-purple-800">{formatMonthYear(currentMonth)}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="text-purple-600 hover:bg-purple-50 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-purple-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day && (
                    <button
                      onClick={() => setSelectedDate(day.hasEntry ? day.dateString : null)}
                      className={`w-full h-full rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all duration-200 ${
                        selectedDate === day.dateString
                          ? "bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-md scale-95"
                          : day.hasEntry
                            ? "bg-purple-100 text-purple-700 hover:bg-purple-150 hover:scale-105"
                            : "text-purple-400 hover:bg-purple-50"
                      }`}
                    >
                      <span>{day.day}</span>
                      {day.hasEntry && (
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-1 ${
                            selectedDate === day.dateString ? "bg-white" : "bg-purple-400"
                          }`}
                        />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Summary */}
        {selectedEntry && (
          <div className="space-y-6">
            {/* 전체 분위기 */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800">
                  <Heart className="w-5 h-5 mr-2 text-pink-500" />
                  {new Date(selectedEntry.date).toLocaleDateString("ko-KR", {
                    month: "long",
                    day: "numeric",
                    weekday: "long"
                  })}의 전체 분위기
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge className={`text-lg px-4 py-2 ${getMoodColor(selectedEntry.overallMood)}`}>
                    {selectedEntry.overallMood}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* 감사 포인트 */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  오늘의 감사 포인트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedEntry.gratitudePoints.map((point, index) => (
                    <div key={index} className="border border-purple-100 rounded-lg p-4 bg-white/50">
                      <p className="text-gray-800">{point}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 오늘의 발견 */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800">
                  <Heart className="w-5 h-5 mr-2 text-pink-500" />
                  오늘의 발견
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">{selectedEntry.discovery}</p>
              </CardContent>
            </Card>

            {/* 세션 정보 */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-purple-600">
                    대화 시간: <span className="font-medium">{selectedEntry.sessionTime}</span>
                  </p>
                  <p className="text-sm text-purple-600">
                    대화 횟수: <span className="font-medium">{selectedEntry.conversationCount}회</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!selectedEntry && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-purple-600 mb-2">점이 있는 날짜를 선택하면 해당 날의 감사 일기를 볼 수 있어요</p>
            <p className="text-sm text-purple-500">하루에 한 번씩 감사한 순간들을 기록해보세요</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-100 px-6 py-4">
        <div className="flex justify-around items-center max-w-sm mx-auto">
          <Link href="/">
            <button className="flex flex-col items-center space-y-1 p-2 rounded-2xl text-purple-400 hover:bg-purple-50 transition-colors">
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">홈</span>
            </button>
          </Link>
          <button className="flex flex-col items-center space-y-1 p-2 rounded-2xl bg-purple-100 text-purple-600">
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">히스토리</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
