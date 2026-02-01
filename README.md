# Character Studio

AI 기반 캐릭터 이미지 대량 생성 웹 애플리케이션

## 주요 기능

- **캐릭터 이미지 업로드**: 드래그 앤 드롭 또는 클릭으로 캐릭터 이미지 업로드
- **9개 변형 이미지 생성**: 다양한 포즈, 표정, 배경으로 캐릭터 변형
- **추가 프롬프트**: 사용자 정의 지시사항 추가 가능
- **다운로드 옵션**:
  - 개별 이미지 다운로드
  - ZIP 압축 파일 다운로드
  - 전체 개별 파일 다운로드

## 기술 스택

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Gemini API (이미지 생성)
- JSZip (압축 다운로드)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 API 키를 설정합니다:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_NANO_BANANA_API_KEY=your_nano_banana_api_key  # 선택사항
```

배포 환경에서는 위 환경 변수를 설정해두면 별도의 입력 없이 바로 사용됩니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
```

## 화면 구성

```
┌─────────────────────────────────────────────────────────────┐
│ Character Studio                              [전체 다운로드]│
├─────────────────┬───────────────────────────────────────────┤
│   좌측 (1/4)    │                우측 (3/4)                  │
│                 │  ┌─────┐ ┌─────┐ ┌─────┐                  │
│  ┌───────────┐  │  │ 1   │ │ 2   │ │ 3   │                  │
│  │  캐릭터   │  │  └─────┘ └─────┘ └─────┘                  │
│  │  업로드   │  │  ┌─────┐ ┌─────┐ ┌─────┐                  │
│  └───────────┘  │  │ 4   │ │ 5   │ │ 6   │                  │
│                 │  └─────┘ └─────┘ └─────┘                  │
│  ┌───────────┐  │  ┌─────┐ ┌─────┐ ┌─────┐                  │
│  │ 추가      │  │  │ 7   │ │ 8   │ │ 9   │                  │
│  │ 프롬프트  │  │  └─────┘ └─────┘ └─────┘                  │
│  └───────────┘  │                                           │
│  [API 키 설정]  │                                           │
│  [생성하기]     │                                           │
└─────────────────┴───────────────────────────────────────────┘
```

## API 키 발급

### Gemini API (필수)
1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. API 키 생성
3. 앱에서 API 키 설정

### Nano Banana Pro API (선택)
- Gemini API 할당량 초과 시 자동으로 사용되는 백업 API

## GitHub Pages 배포

GitHub Pages로 배포하기 위해 기본 워크플로우와 `BASE_PATH` 환경 변수를 사용합니다.

### 1) GitHub Actions 워크플로우 확인

`.github/workflows/deploy.yml`이 기본으로 포함되어 있습니다. `main` 브랜치에 push되면 자동으로 빌드/배포됩니다.

> 참고: GitHub UI에서 “Deploy static content to GitHub Pages” 템플릿이 보이지 않는 경우가 있습니다. 이때는 템플릿을 찾지 말고 `deploy.yml`을 직접 커밋하는 방식이 가장 빠르고 확실합니다.

### 2) BASE_PATH 설정

GitHub Pages는 리포지토리 이름에 따라 경로가 달라집니다.

- **프로젝트 페이지** (예: `https://username.github.io/characterstudio/`)
  - 기본값 `/${repoName}/`을 사용하므로 별도 수정 없이 배포됩니다.
- **유저/조직 페이지** (예: `https://username.github.io/`)
  - `BASE_PATH`를 `/`로 변경해야 합니다.
  - `.github/workflows/deploy.yml`에서 `BASE_PATH` 값을 `/`로 수정하세요.

### 3) GitHub Pages 설정

1. GitHub 저장소 → **Settings** → **Pages**
2. **Build and deployment**에서 Source를 **GitHub Actions**로 선택
3. 배포가 완료되면 제공되는 URL로 접속

### 4) 배포 확인

배포 후 페이지가 하얗게 나오면 `BASE_PATH` 설정이 맞는지 다시 확인하세요.

## 라이선스

MIT License
