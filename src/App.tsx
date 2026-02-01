import { useState, useCallback } from 'react';
import {
  Header,
  ImageUpload,
  PromptInput,
  GenerateButton,
  ImageGrid,
  ApiKeyInput,
} from './components';
import type { GeneratedImage } from './types';
import { generateImages, resetApiProvider } from './services/imageApi';

function App() {
  // 상태 관리
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 9, currentTheme: '' });
  const [apiKeys, setApiKeys] = useState({ gemini: '', nanoBanana: '' });

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback((file: File, previewUrl: string) => {
    setUploadedImage(previewUrl);
    setUploadedFile(file);
    setError(null);
  }, []);

  // 이미지 클리어 핸들러
  const handleClear = useCallback(() => {
    setUploadedImage(null);
    setUploadedFile(null);
    setGeneratedImages([]);
    setError(null);
    resetApiProvider();
  }, []);

  // API 키 변경 핸들러
  const handleApiKeyChange = useCallback((geminiKey: string, nanoBananaKey: string) => {
    setApiKeys({ gemini: geminiKey, nanoBanana: nanoBananaKey });
  }, []);

  // 이미지 생성 핸들러
  const handleGenerate = useCallback(async () => {
    if (!uploadedFile) {
      setError('먼저 캐릭터 이미지를 업로드해주세요.');
      return;
    }

    if (!apiKeys.gemini) {
      setError('Gemini API 키를 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);
    setProgress({ current: 0, total: 9, currentTheme: '준비 중...' });

    try {
      // 로컬 스토리지의 API 키를 환경 변수처럼 사용
      (window as unknown as Record<string, string>).__GEMINI_API_KEY__ = apiKeys.gemini;
      (window as unknown as Record<string, string>).__NANO_BANANA_API_KEY__ = apiKeys.nanoBanana;

      const images = await generateImages(
        uploadedFile,
        additionalPrompt,
        (completed, total, currentTheme) => {
          setProgress({ current: completed, total, currentTheme });
          // 실시간으로 생성된 이미지 추가
        }
      );

      setGeneratedImages(images);

      if (images.length === 0) {
        setError('이미지 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('이미지 생성 오류:', err);
      setError(
        err instanceof Error
          ? err.message
          : '이미지 생성 중 오류가 발생했습니다.'
      );
    } finally {
      setIsGenerating(false);
    }
  }, [uploadedFile, additionalPrompt, apiKeys]);

  const canGenerate = uploadedFile !== null && apiKeys.gemini.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* 배경 그라데이션 효과 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* 헤더 */}
      <Header images={generatedImages} isGenerating={isGenerating} />

      {/* 메인 컨텐츠 */}
      <main className="relative max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 좌측 패널 - 업로드 및 설정 */}
          <aside className="w-full lg:w-1/4 lg:min-w-[320px]">
            <div className="sticky top-8 space-y-6">
              {/* 업로드 영역 */}
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  캐릭터 업로드
                </h2>
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  uploadedImage={uploadedImage}
                  onClear={handleClear}
                  disabled={isGenerating}
                />
              </div>

              {/* 프롬프트 입력 */}
              <div className="glass rounded-2xl p-6">
                <PromptInput
                  value={additionalPrompt}
                  onChange={setAdditionalPrompt}
                  disabled={isGenerating}
                />
              </div>

              {/* API 키 설정 */}
              <div className="glass rounded-2xl p-6">
                <ApiKeyInput onApiKeyChange={handleApiKeyChange} />
              </div>

              {/* 생성 버튼 */}
              <GenerateButton
                onClick={handleGenerate}
                isGenerating={isGenerating}
                disabled={!canGenerate}
                progress={isGenerating ? progress : undefined}
              />

              {/* 에러 메시지 */}
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
            </div>
          </aside>

          {/* 우측 패널 - 생성된 이미지 그리드 */}
          <section className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                생성된 이미지
              </h2>
              <p className="text-sm text-gray-400">
                {generatedImages.length > 0
                  ? `${generatedImages.length}개의 이미지가 생성되었습니다`
                  : '캐릭터를 업로드하고 생성 버튼을 클릭하세요'}
              </p>
            </div>

            <ImageGrid
              images={generatedImages}
              isGenerating={isGenerating}
              progress={progress}
            />
          </section>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="relative mt-16 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-sm text-gray-500">
            Character Studio • AI 기반 캐릭터 이미지 생성 도구
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
