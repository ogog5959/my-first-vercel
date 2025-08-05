import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'TTS API key not configured' });
    }

    const response = await fetch(`https://texttospeech.googleapis.com/v1/voices?key=${apiKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Voices API Error:', errorText);
      return res.status(response.status).json({ 
        error: `Voices API request failed: ${response.status}`,
        details: errorText 
      });
    }

    const data = await response.json();
    
    // 한국어 음성만 필터링
    const koreanVoices = data.voices?.filter((voice: any) => 
      voice.languageCodes.includes('ko-KR')
    ) || [];

    return res.status(200).json({ voices: koreanVoices });

  } catch (error) {
    console.error('Voices API request failed:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 