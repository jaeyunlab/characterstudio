import { Sparkles } from 'lucide-react';
import type { GeneratedImage } from '../types';
import { DownloadMenu } from './DownloadMenu';

interface HeaderProps {
  images: GeneratedImage[];
  isGenerating: boolean;
}

export function Header({ images, isGenerating }: HeaderProps) {
  return (
    <header className="w-full py-4 px-4 md:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={22} className="text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold gradient-text">
            Character Studio
          </h1>
        </div>

        {/* 다운로드 메뉴 */}
        <DownloadMenu images={images} disabled={isGenerating || images.length === 0} />
      </div>
    </header>
  );
}
