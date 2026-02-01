import { Wand2, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled?: boolean;
  progress?: {
    current: number;
    total: number;
    currentTheme: string;
  };
}

export function GenerateButton({
  onClick,
  isGenerating,
  disabled = false,
  progress,
}: GenerateButtonProps) {
  return (
    <div className="w-full">
      <button
        onClick={onClick}
        disabled={disabled || isGenerating}
        className={`
          btn-primary w-full py-4 px-6 rounded-xl
          flex items-center justify-center gap-3
          text-white font-semibold text-lg
          ${disabled || isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isGenerating ? (
          <>
            <Loader2 size={24} className="animate-spin" />
            <span>생성 중...</span>
          </>
        ) : (
          <>
            <Wand2 size={24} />
            <span>이미지 생성하기</span>
          </>
        )}
      </button>

      {isGenerating && progress && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{progress.currentTheme}</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
