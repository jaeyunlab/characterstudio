// 생성된 이미지 타입
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  promptKo: string;
  timestamp: number;
  blob?: Blob;
}

// 이미지 생성 주제 타입
export interface ImageTheme {
  ko: string;
  en: string;
}

// API 응답 타입
export interface ApiResponse {
  success: boolean;
  images?: string[];
  error?: string;
}

// 앱 상태 타입
export interface AppState {
  uploadedImage: string | null;
  uploadedFile: File | null;
  generatedImages: GeneratedImage[];
  isGenerating: boolean;
  additionalPrompt: string;
  error: string | null;
  currentApi: 'gemini' | 'nanoBanana';
}

// API 설정 타입
export interface ApiConfig {
  geminiApiKey: string;
  nanoBananaApiKey: string;
}
