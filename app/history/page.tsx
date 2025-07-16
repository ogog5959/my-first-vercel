"use client"

import { ChevronLeft, ChevronRight, Home, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

interface JournalEntry {
  date: string
  emotion: {
    emoji: string
    label: string
    color: string
  }
  gratitude: string[]
  sessionTime: string
}

const journalData: Record<string, JournalEntry> = {
  "2024-01-15": {
    date: "2024-01-15",
    emotion: { emoji: "😊", label: "Warm", color: "from-orange-200 to-pink-200" },
    gratitude: [
      "Having supportive colleagues during busy meetings",
      "Taking time to breathe between tasks",
      "Recognizing my own resilience",
    ],
    sessionTime: "8:42",
  },
  "2024-01-12": {
    date: "2024-01-12",
    emotion: { emoji: "🌱", label: "Hopeful", color: "from-green-200 to-teal-200" },
    gratitude: ["A peaceful morning walk", "Connecting with an old friend", "Small progress on personal goals"],
    sessionTime: "6:23",
  },
  "2024-01-10": {
    date: "2024-01-10",
    emotion: { emoji: "💙", label: "Calm", color: "from-blue-200 to-indigo-200" },
    gratitude: ["A quiet evening at home", "Finishing a good book", "Feeling centered and peaceful"],
    sessionTime: "5:15",
  },
  "2024-01-08": {
    date: "2024-01-08",
    emotion: { emoji: "✨", label: "Inspired", color: "from-purple-200 to-pink-200" },
    gratitude: ["Learning something new today", "Creative energy flowing freely", "Feeling motivated about the future"],
    sessionTime: "7:31",
  },
}

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>("2024-01-15")
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0, 1)) // January 2024

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
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
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

  const days = getDaysInMonth(currentMonth)
  const selectedEntry = selectedDate ? journalData[selectedDate] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-purple-800">Your Journey</h1>
            <p className="text-purple-600">Reflecting on your growth</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </header>

      {/* Calendar */}
      <main className="px-6 pb-32">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-purple-100 mb-6">
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
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
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
        </div>

        {/* Selected Date Summary */}
        {selectedEntry && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-purple-100 space-y-6">
            {/* Date Header */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                {new Date(selectedEntry.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className="flex justify-center">
                <div className={`bg-gradient-to-r ${selectedEntry.emotion.color} px-4 py-2 rounded-full`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{selectedEntry.emotion.emoji}</span>
                    <span className="font-medium text-gray-700">{selectedEntry.emotion.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gratitude Points */}
            <div>
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                <span className="text-lg mr-2">🙏</span>
                Gratitude highlights
              </h4>
              <ul className="space-y-2">
                {selectedEntry.gratitude.map((point, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-purple-700 text-sm leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Session Info */}
            <div className="text-center pt-4 border-t border-purple-100">
              <p className="text-sm text-purple-600">
                Session time: <span className="font-medium">{selectedEntry.sessionTime}</span>
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedEntry && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-purple-600 mb-2">Select a date with a dot to see your journal entry</p>
            <p className="text-sm text-purple-500">Each dot represents a day you shared your thoughts</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-100 px-6 py-4">
        <div className="flex justify-around items-center max-w-sm mx-auto">
          <Link href="/">
            <button className="flex flex-col items-center space-y-1 p-2 rounded-2xl text-purple-400 hover:bg-purple-50 transition-colors">
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
          </Link>
          <button className="flex flex-col items-center space-y-1 p-2 rounded-2xl bg-purple-100 text-purple-600">
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">History</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
