import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body

  const apiKey = process.env.GEMINI_API_KEY // 보안 환경변수로 변경
  const model = process.env.NEXT_PUBLIC_GEMINI_MODEL
  const baseUrl = process.env.NEXT_PUBLIC_GEMINI_BASE_URL

  try {
    const response = await fetch(`${baseUrl}/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: data })
    }
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Gemini API 호출 실패', detail: String(error) })
  }
} 