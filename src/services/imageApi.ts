import type { GeneratedImage, ImageTheme } from '../types';
import { getRandomThemes } from '../utils/themes';
import { fileToBase64, base64ToUrl, generateId } from '../utils/helpers';

// API 키 가져오기 (우선순위: window 전역변수 > 로컬스토리지 > 환경변수)
const getGeminiApiKey = (): string => {
  const windowKey = (window as unknown as Record<string, string>).__GEMINI_API_KEY__;
  if (windowKey) return windowKey;

  const storageKey = localStorage.getItem('gemini_api_key');
  if (storageKey) return storageKey;

  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

const getNanoBananaApiKey = (): string => {
  const windowKey = (window as unknown as Record<string, string>).__NANO_BANANA_API_KEY__;
  if (windowKey) return windowKey;

  const storageKey = localStorage.getItem('nano_banana_api_key');
  if (storageKey) return storageKey;

  return import.meta.env.VITE_NANO_BANANA_API_KEY || '';
};

// 현재 사용 중인 API 추적
let currentApiProvider: 'gemini' | 'nanoBanana' = 'gemini';

export function getCurrentApiProvider(): 'gemini' | 'nanoBanana' {
  return currentApiProvider;
}

// Gemini API를 통한 이미지 생성
async function generateWithGemini(
  imageBase64: string,
  theme: ImageTheme,
  additionalPrompt: string
): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }

  const prompt = buildPrompt(theme, additionalPrompt);

  // Gemini 2.0 Flash를 사용한 이미지 생성 (이미지 편집/변형)
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: 'image/png',
                  data: imageBase64,
                },
              },
              {
                text: `Based on this character image, create a new illustration of the SAME character with the following changes. Keep the character's design, art style, and colors exactly the same, but change the pose/expression/scene as described:

${prompt}

Important:
- Maintain the exact same character design and art style
- Keep all distinctive features of the character
- Only change what is specified in the prompt
- Generate a complete, high-quality illustration`,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['image', 'text'],
          imageSafety: 'block_only_high',
        },
      }),
    }
  );

  if (response.status === 429) {
    throw new Error('RATE_LIMIT');
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API Error:', errorText);
    throw new Error(`Gemini API 오류: ${response.status}`);
  }

  const data = await response.json();

  // 응답에서 이미지 데이터 추출
  const candidates = data.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error('이미지 생성 결과가 없습니다.');
  }

  const parts = candidates[0].content?.parts;
  if (!parts) {
    throw new Error('응답 형식이 올바르지 않습니다.');
  }

  // 이미지 파트 찾기
  for (const part of parts) {
    if (part.inlineData?.data) {
      return part.inlineData.data;
    }
  }

  throw new Error('생성된 이미지를 찾을 수 없습니다.');
}

// Nano Banana API를 통한 이미지 생성 (폴백)
async function generateWithNanoBanana(
  imageBase64: string,
  theme: ImageTheme,
  additionalPrompt: string
): Promise<string> {
  const apiKey = getNanoBananaApiKey();
  if (!apiKey) {
    throw new Error('Nano Banana API 키가 설정되지 않았습니다.');
  }

  const prompt = buildPrompt(theme, additionalPrompt);

  // Nano Banana Pro API 호출
  const response = await fetch('https://api.nanobanana.pro/v1/images/edits', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      image: imageBase64,
      prompt: `Transform this character illustration: ${prompt}. Maintain the same character design and art style.`,
      n: 1,
      size: '1024x1024',
    }),
  });

  if (!response.ok) {
    throw new Error(`Nano Banana API 오류: ${response.status}`);
  }

  const data = await response.json();

  if (data.data && data.data[0]) {
    if (data.data[0].b64_json) {
      return data.data[0].b64_json;
    }
    if (data.data[0].url) {
      // URL에서 이미지 가져오기
      const imgResponse = await fetch(data.data[0].url);
      const blob = await imgResponse.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(blob);
      });
    }
  }

  throw new Error('이미지 생성 결과가 없습니다.');
}

// 프롬프트 빌드
function buildPrompt(theme: ImageTheme, additionalPrompt: string): string {
  let prompt = theme.en;

  if (additionalPrompt.trim()) {
    prompt += `. Additional requirements: ${additionalPrompt}`;
  }

  return prompt;
}

// 단일 이미지 생성 (폴백 로직 포함)
async function generateSingleImage(
  imageBase64: string,
  theme: ImageTheme,
  additionalPrompt: string
): Promise<string> {
  try {
    // 먼저 Gemini API 시도
    if (currentApiProvider === 'gemini') {
      return await generateWithGemini(imageBase64, theme, additionalPrompt);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'RATE_LIMIT') {
      console.log('Gemini API 할당량 초과, Nano Banana로 전환합니다.');
      currentApiProvider = 'nanoBanana';
    } else {
      throw error;
    }
  }

  // Nano Banana API로 폴백
  return await generateWithNanoBanana(imageBase64, theme, additionalPrompt);
}

// 9개의 이미지 생성
export async function generateImages(
  uploadedFile: File,
  additionalPrompt: string,
  onProgress?: (completed: number, total: number, currentTheme: string) => void
): Promise<GeneratedImage[]> {
  const imageBase64 = await fileToBase64(uploadedFile);
  const themes = getRandomThemes(9);
  const results: GeneratedImage[] = [];

  // 순차적으로 이미지 생성 (API 제한 고려)
  for (let i = 0; i < themes.length; i++) {
    const theme = themes[i];

    if (onProgress) {
      onProgress(i, themes.length, theme.ko);
    }

    try {
      const generatedBase64 = await generateSingleImage(imageBase64, theme, additionalPrompt);
      const imageUrl = base64ToUrl(generatedBase64);

      results.push({
        id: generateId(),
        url: imageUrl,
        prompt: theme.en,
        promptKo: theme.ko,
        timestamp: Date.now(),
      });

      // API 제한을 위한 딜레이
      if (i < themes.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`이미지 ${i + 1} 생성 실패:`, error);
      // 실패해도 계속 진행
    }
  }

  if (onProgress) {
    onProgress(themes.length, themes.length, '완료');
  }

  return results;
}

// API 상태 초기화
export function resetApiProvider(): void {
  currentApiProvider = 'gemini';
}
