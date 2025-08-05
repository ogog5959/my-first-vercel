// Google Cloud Text-to-Speech API 서비스 (Chirp3) - 서버 API 라우트 사용

export interface TTSResponse {
  audioContent: string;
  error?: string;
}

class TTSService {
  async synthesizeSpeech(text: string): Promise<TTSResponse> {
    try {
      console.log('TTS 요청 시작:', text.substring(0, 50) + '...');
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      console.log('TTS 응답 상태:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('TTS API Error:', errorData);
        throw new Error(`TTS API request failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('TTS 성공:', data.audioContent ? '오디오 생성됨' : '오디오 없음');
      
      return { audioContent: data.audioContent };
    } catch (error) {
      console.error('TTS API request failed:', error);
      return { 
        audioContent: '', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Base64 오디오를 Audio 객체로 변환
  playAudio(audioContent: string): HTMLAudioElement | null {
    try {
      if (!audioContent) {
        console.error('Audio content is empty');
        return null;
      }
      
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      return audio;
    } catch (error) {
      console.error('Audio playback failed:', error);
      return null;
    }
  }
}

export const ttsService = new TTSService(); 