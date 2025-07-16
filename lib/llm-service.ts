import { config } from './config'
import { CHAT_PROMPT, SUMMARY_PROMPT, ADVICE_PROMPT } from './prompts'

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  content: string
  error?: string
}

export interface SummaryResponse {
  points: string[]
  error?: string
}

export interface AdviceResponse {
  discovery: string
  suggestion: string
  encouragement: string
  error?: string
}

class LLMService {
  private async makeRequest(messages: Message[]): Promise<any> {
    try {
      // Gemini API로 보낼 때 system 역할 메시지 제외
      const contents = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))

      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: contents }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`API request failed: ${response.status} - ${text}`)
      }

      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    } catch (error) {
      console.error('LLM API request failed:', error)
      throw error
    }
  }

  // 대화 시작
  async startChat(): Promise<ChatResponse> {
    try {
      const messages: Message[] = [
        { role: 'system', content: CHAT_PROMPT },
        { role: 'user', content: '대화를 시작해주세요.' }
      ]

      const response = await this.makeRequest(messages)
      return { content: response }
    } catch (error) {
      return { 
        content: '안녕하세요! 오늘 하루는 어떠셨나요?', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // 사용자 메시지에 대한 응답
  async chatResponse(userMessage: string, conversationHistory: Message[]): Promise<ChatResponse> {
    try {
      const messages: Message[] = [
        { role: 'system', content: CHAT_PROMPT },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ]

      const response = await this.makeRequest(messages)
      return { content: response }
    } catch (error) {
      return { 
        content: '죄송해요, 잠시 문제가 생겼어요. 다시 말씀해주시겠어요?', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // 대화 요약
  async summarizeConversation(conversationHistory: Message[]): Promise<SummaryResponse> {
    try {
      const conversationText = conversationHistory
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`)
        .join('\n')

      const prompt = SUMMARY_PROMPT.replace('{conversation}', conversationText)
      const messages: Message[] = [
        { role: 'user' as const, content: prompt }
      ]

      const response = await this.makeRequest(messages)
      // 1. 2. 3. 또는 1) 2) 3) 등으로 시작하는 줄만 파싱
      const points = response
        .split('\n')
        .filter((line: string) => line.trim() && (line.match(/^\d+[\.|\)]/) || line.match(/^[•·]/)))
        .map((line: string) => line.replace(/^\d+[\.|\)]\s*|^[•·]\s*/, '').trim())
        .slice(0, 3)
      return { points }
    } catch (error) {
      return { 
        points: [
          '오늘 하루를 마무리한 당신의 노력',
          '작은 순간들을 소중히 여기는 마음',
          '자신을 돌아보는 용기'
        ], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // 내일을 위한 조언
  async generateAdvice(summaryPoints: string[]): Promise<AdviceResponse> {
    try {
      const summaryText = summaryPoints.map((p, i) => `${i+1}. ${p}`).join('\n')
      const prompt = ADVICE_PROMPT.replace('{summary}', summaryText)
      const messages: Message[] = [
        { role: 'user' as const, content: prompt }
      ]

      const response = await this.makeRequest(messages)
      // '오늘의 발견:'으로 시작하는 한 줄만 추출
      let discovery = ''
      const lines = response.split('\n').filter((line: string) => line.trim())
      for (const line of lines) {
        if (line.includes('오늘의 발견')) {
          discovery = line.replace(/^.*?:\s*/, '').trim()
        }
      }
      if (!discovery) discovery = '오늘의 감사 포인트를 통해 당신의 하루가 얼마나 소중했는지 알 수 있었어요.'
      return { discovery, suggestion: '', encouragement: '' }
    } catch (error) {
      return { 
        discovery: '오늘의 감사 포인트를 통해 당신의 하루가 얼마나 소중했는지 알 수 있었어요.',
        suggestion: '',
        encouragement: '',
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}

export const llmService = new LLMService() 