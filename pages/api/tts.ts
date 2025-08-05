import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'TTS API key not configured' });
    }

    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          text: text
        },
        voice: {
          languageCode: 'ko-KR',
          name: 'ko-KR-Chirp3-HD-Achernar', // 자연스러운 Chirp3 HD 음성
          ssmlGender: 'FEMALE'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0.0,
          effectsProfileId: ['headphone-class-device']
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TTS API Error:', errorText);
      return res.status(response.status).json({ 
        error: `TTS API request failed: ${response.status}`,
        details: errorText 
      });
    }

    const data = await response.json();
    return res.status(200).json({ audioContent: data.audioContent });

  } catch (error) {
    console.error('TTS API request failed:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 