// 환경 변수 및 API 설정

export const config = {
  // LLM API 설정 (Gemini 2.5 Flash)
  llm: {
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
    baseUrl: process.env.NEXT_PUBLIC_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
    model: process.env.NEXT_PUBLIC_GEMINI_MODEL || 'models/gemini-2.0-flash-exp',
    maxTokens: parseInt(process.env.NEXT_PUBLIC_GEMINI_MAX_TOKENS || '1000'),
  },
  
  // 앱 설정
  app: {
    name: 'Thanks to Me',
    version: '1.0.0',
    description: '감사 일기 음성 저널링 앱',
  },
  
  // 세션 설정
  session: {
    maxDuration: 30 * 60 * 1000, // 30분 (밀리초)
    autoSaveInterval: 5 * 60 * 1000, // 5분마다 자동 저장
  },
}

// 환경 변수 검증
export const validateConfig = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_GEMINI_API_KEY',
  ]
  
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  )
  
  if (missingVars.length > 0) {
    console.warn(
      `Missing required environment variables: ${missingVars.join(', ')}`
    )
    return false
  }
  
  return true
} 