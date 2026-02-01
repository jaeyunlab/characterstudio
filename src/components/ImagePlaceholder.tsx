import { ImageIcon, Loader2 } from 'lucide-react';

interface ImagePlaceholderProps {
  index: number;
  isGenerating?: boolean;
}

export function ImagePlaceholder({ index, isGenerating = false }: ImagePlaceholderProps) {
  return (
    <div
      className={`
        aspect-square rounded-2xl overflow-hidden
        bg-gray-900/30 border border-white/5
        flex flex-col items-center justify-center
        ${isGenerating ? 'animate-pulse-glow' : ''}
      `}
    >
      {isGenerating ? (
        <>
          <div className="relative w-16 h-16 mb-3">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
            <div className="relative w-full h-full rounded-full bg-indigo-500/30 flex items-center justify-center">
              <Loader2 size={28} className="text-indigo-400 animate-spin" />
            </div>
          </div>
          <p className="text-sm text-indigo-400 font-medium">생성 중...</p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
            <ImageIcon size={28} className="text-gray-600" />
          </div>
          <p className="text-sm text-gray-600">이미지 {index + 1}</p>
        </>
      )}
    </div>
  );
}
