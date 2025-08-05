"use client"

import { PhoneOff, Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { llmService, Message as LLMMessage } from "@/lib/llm-service"
import { ttsService } from "@/lib/tts-service"

// Web Speech API 타입 정의
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface Message {
  id: number
  type: "ai" | "user"
  content: string
  timestamp: string
  isVoice?: boolean
  audioContent?: string
}

export default function ChatPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<LLMMessage[]>([])
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({})
  const router = useRouter();

  // Web Speech API 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ko-KR';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsRecording(false);
        if (transcript.trim()) {
          setInputMessage(transcript);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [transcript]);

  // 대화 시작 시 AI 첫 메시지
  useEffect(() => {
    const startConversation = async () => {
      setIsLoading(true)
      try {
        const response = await llmService.startChat()
        const newMessage: Message = {
          id: 1,
          type: "ai",
          content: response.content,
          timestamp: new Date().toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        }
        setMessages([newMessage])
        setConversationHistory([
          { role: 'system' as const, content: '대화 시작' },
          { role: 'assistant' as const, content: response.content }
        ])
        
        // 첫 메시지 TTS 생성
        const ttsResponse = await ttsService.synthesizeSpeech(response.content);
        if (ttsResponse.audioContent) {
          setMessages(prev => prev.map(msg => 
            msg.id === 1 ? { ...msg, audioContent: ttsResponse.audioContent } : msg
          ));
        }
      } catch (error) {
        console.error('대화 시작 실패:', error)
        const fallbackMessage: Message = {
          id: 1,
          type: "ai",
          content: "안녕하세요! 오늘 하루는 어떠셨나요?",
          timestamp: new Date().toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        }
        setMessages([fallbackMessage])
      } finally {
        setIsLoading(false)
      }
    }

    if (messages.length === 0) {
      startConversation()
    }
  }, [])

  // 메시지 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isVoice: isRecording,
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // 대화 히스토리 업데이트
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user' as const, content: inputMessage }
      ]

      const response = await llmService.chatResponse(inputMessage, updatedHistory)
      
      const aiMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        content: response.content,
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      }

      setMessages(prev => [...prev, aiMessage])
      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant' as const, content: response.content }
      ])

      // AI 응답 TTS 생성
      const ttsResponse = await ttsService.synthesizeSpeech(response.content);
      if (ttsResponse.audioContent) {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id ? { ...msg, audioContent: ttsResponse.audioContent } : msg
        ));
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error)
      const errorMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        content: "죄송해요, 잠시 문제가 생겼어요. 다시 말씀해주시겠어요?",
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('이 브라우저는 음성인식을 지원하지 않습니다.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  }

  const playAudio = async (messageId: number, audioContent: string) => {
    try {
      // 이전 오디오 중지
      if (playingAudio && audioRefs.current[playingAudio]) {
        audioRefs.current[playingAudio].pause();
        audioRefs.current[playingAudio].currentTime = 0;
      }

      // 새 오디오 재생
      const audio = ttsService.playAudio(audioContent);
      if (audio) {
        audioRefs.current[messageId] = audio;
        setPlayingAudio(messageId);
        
        audio.onended = () => {
          setPlayingAudio(null);
        };
        
        audio.onerror = () => {
          setPlayingAudio(null);
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
      setPlayingAudio(null);
    }
  }

  const handleEndCall = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('thanksToMe_conversationHistory', JSON.stringify(conversationHistory));
    }
    router.push("/summary");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 px-4 py-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center">
          <div className="relative">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-purple-800 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-purple-800 rounded-full"></div>
            </div>
            <div className="w-3 h-1.5 border-b-2 border-purple-800 rounded-full mx-auto mt-0.5"></div>
          </div>
        </div>
        <div>
          <h1 className="font-semibold text-purple-800">Thanks to Me</h1>
          <p className="text-sm text-purple-600">Voice Journal Session</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center space-x-1 text-green-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">Active</span>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} items-end space-x-2`}
          >
            {/* AI Avatar */}
            {message.type === "ai" && (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="relative">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-purple-800 rounded-full"></div>
                    <div className="w-1 h-1 bg-purple-800 rounded-full"></div>
                  </div>
                  <div className="w-2 h-1 border-b border-purple-800 rounded-full mx-auto"></div>
                </div>
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-3xl ${
                message.type === "ai"
                  ? "bg-white shadow-sm border border-purple-100 text-purple-800"
                  : "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
              }`}
            >
              {message.isVoice && (
                <div className="flex items-center space-x-2 mb-2">
                  <Mic className="w-3 h-3 opacity-70" />
                  <div className="flex space-x-1">
                    <div className="w-1 h-3 bg-current opacity-60 rounded-full animate-pulse"></div>
                    <div className="w-1 h-4 bg-current opacity-80 rounded-full animate-pulse delay-100"></div>
                    <div className="w-1 h-2 bg-current opacity-60 rounded-full animate-pulse delay-200"></div>
                    <div className="w-1 h-5 bg-current opacity-90 rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${message.type === "ai" ? "text-purple-500" : "text-white/70"}`}>
                  {message.timestamp}
                </p>
                {/* AI 메시지에 음성 재생 버튼 추가 */}
                {message.type === "ai" && message.audioContent && (
                  <Button
                    onClick={() => playAudio(message.id, message.audioContent!)}
                    disabled={playingAudio === message.id}
                    className="w-6 h-6 rounded-full bg-purple-100 hover:bg-purple-200 p-0 ml-2"
                  >
                    {playingAudio === message.id ? (
                      <VolumeX className="w-3 h-3 text-purple-600" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-purple-600" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* User Avatar */}
            {message.type === "user" && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-teal-300 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="text-xs font-bold text-blue-800">지</div>
              </div>
            )}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start items-end space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="relative">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-purple-800 rounded-full"></div>
                  <div className="w-1 h-1 bg-purple-800 rounded-full"></div>
                </div>
                <div className="w-2 h-1 border-b border-purple-800 rounded-full mx-auto"></div>
              </div>
            </div>
            <div className="bg-white shadow-sm border border-purple-100 px-4 py-3 rounded-3xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-md border-t border-purple-100 px-4 py-4">
        <div className="flex items-center space-x-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "음성 인식 중..." : "메시지를 입력하세요..."}
            className="flex-1 rounded-full border-purple-200 focus:border-purple-400"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>

        {/* Voice Recording Area */}
        <div className="mt-4">
          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600">
                {isListening ? "음성 인식 중..." : "녹음 중..."}
              </span>
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse delay-100"></div>
                <div className="w-1 h-3 bg-red-400 rounded-full animate-pulse delay-200"></div>
                <div className="w-1 h-5 bg-red-500 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6">
            {/* Record Button */}
            <Button
              onClick={toggleRecording}
              className={`w-16 h-16 rounded-full transition-all duration-300 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 scale-110"
                  : "bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500"
              } shadow-lg`}
            >
              {isRecording ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </Button>

            {/* End Call Button */}
            <Button onClick={handleEndCall} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transition-all duration-300 hover:scale-105">
              <PhoneOff className="w-6 h-6 text-white" />
            </Button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-purple-600">
              {isRecording ? "마이크를 탭하여 녹음 중지" : "마이크를 탭하여 음성으로 대화"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
