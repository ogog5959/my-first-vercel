# Thanks to Me - 감사 일기 음성 저널링 앱

자신에게 감사하는 순간들을 발견하고 기록하는 AI 기반 음성 저널링 앱입니다.

## 🚀 주요 기능

- **AI 상담사와의 자연스러운 대화**: 하루를 돌아보며 감사할 점들을 찾아냅니다
- **음성 인식**: 음성으로 편리하게 대화할 수 있습니다
- **자동 요약**: 대화 내용을 바탕으로 감사 포인트 3줄을 자동으로 요약합니다
- **내일을 위한 조언**: 오늘의 발견을 바탕으로 내일을 위한 따뜻한 조언을 제공합니다
- **히스토리 관리**: 과거 세션들을 캘린더 형태로 확인할 수 있습니다

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI
- **AI**: OpenAI GPT API
- **음성**: Web Speech API (예정)

## 📦 설치 및 설정

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd thanks-to-me-app
```

### 2. 의존성 설치
```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 3. 환경 변수 설정
`env.example` 파일을 복사하여 `.env.local` 파일을 생성하고 API 키를 설정하세요:

```bash
cp env.example .env.local
```

`.env.local` 파일을 편집하여 OpenAI API 키를 설정하세요:
```env
NEXT_PUBLIC_LLM_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_LLM_BASE_URL=https://api.openai.com/v1
NEXT_PUBLIC_LLM_MODEL=gpt-3.5-turbo
NEXT_PUBLIC_LLM_MAX_TOKENS=1000
```

### 4. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인하세요.

## 🎯 사용 방법

### 1. 대화 시작
- 홈 화면에서 "Start Session" 버튼을 클릭합니다
- AI 상담사가 "오늘 하루는 어떠셨나요?"로 대화를 시작합니다

### 2. 음성 대화
- 마이크 버튼을 눌러 음성으로 대화할 수 있습니다
- 자연스럽게 하루의 경험을 이야기해주세요

### 3. 세션 완료
- 대화가 끝나면 "End Call" 버튼을 클릭합니다
- AI가 대화 내용을 분석하여 감사 포인트 3줄을 요약합니다
- 내일을 위한 따뜻한 조언을 받을 수 있습니다

### 4. 히스토리 확인
- "Your Journey" 페이지에서 과거 세션들을 확인할 수 있습니다
- 캘린더에서 특정 날짜를 클릭하여 해당 세션의 요약을 볼 수 있습니다

## 🤖 AI 프롬프트 구조

앱은 세 가지 주요 프롬프트를 사용합니다:

### 1. 대화 프롬프트 (`CHAT_PROMPT`)
- 사용자와 자연스럽고 따뜻한 대화를 나눕니다
- 감사할 점들을 발견할 수 있도록 이끌어줍니다
- 공감적이고 격려적인 톤을 유지합니다

### 2. 요약 프롬프트 (`SUMMARY_PROMPT`)
- 대화 내용을 분석하여 감사 포인트 3줄을 요약합니다
- 구체적이고 개인적인 경험을 반영합니다
- 긍정적 관점에서 자기 감사를 강조합니다

### 3. 조언 프롬프트 (`ADVICE_PROMPT`)
- 오늘의 발견을 바탕으로 내일을 위한 조언을 제공합니다
- 실용적이고 실천 가능한 제안을 합니다
- 따뜻하고 동기부여가 되는 메시지를 전달합니다

## 📁 프로젝트 구조

```
thanks-to-me-app/
├── app/                    # Next.js 앱 라우터
│   ├── chat/              # 대화 페이지
│   ├── summary/           # 요약 페이지
│   ├── history/           # 히스토리 페이지
│   └── layout.tsx         # 레이아웃
├── components/            # UI 컴포넌트
│   └── ui/               # Radix UI 컴포넌트
├── lib/                  # 유틸리티 및 서비스
│   ├── prompts.ts        # AI 프롬프트 정의
│   ├── llm-service.ts    # LLM API 서비스
│   └── config.ts         # 설정 관리
├── hooks/                # 커스텀 훅
└── public/               # 정적 파일
```

## 🔧 개발 가이드

### 새로운 프롬프트 추가
`lib/prompts.ts` 파일에 새로운 프롬프트를 추가하고, `lib/llm-service.ts`에서 해당 메서드를 구현하세요.

### UI 컴포넌트 수정
`components/ui/` 디렉토리의 Radix UI 컴포넌트들을 기반으로 커스터마이징하세요.

### API 키 관리
- `.env.local` 파일에 API 키를 저장하세요
- API 키는 절대 Git에 커밋하지 마세요
- 프로덕션에서는 환경 변수를 안전하게 관리하세요

## 🚀 배포

### Vercel 배포 (권장)
1. GitHub에 코드를 푸시합니다
2. Vercel에서 프로젝트를 연결합니다
3. 환경 변수를 Vercel 대시보드에서 설정합니다
4. 자동 배포가 완료됩니다

### 다른 플랫폼
```bash
npm run build
npm start
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🙏 감사의 말

- [OpenAI](https://openai.com/) - GPT API 제공
- [Next.js](https://nextjs.org/) - React 프레임워크
- [Radix UI](https://www.radix-ui.com/) - 접근 가능한 UI 컴포넌트
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크 