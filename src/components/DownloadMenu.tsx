import { useState, useRef, useEffect } from 'react';
import { Download, Archive, Files, ChevronDown, Loader2 } from 'lucide-react';
import type { GeneratedImage } from '../types';
import { downloadAllAsZip, downloadAllIndividually } from '../utils/download';

interface DownloadMenuProps {
  images: GeneratedImage[];
  disabled?: boolean;
}

export function DownloadMenu({ images, disabled = false }: DownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<'zip' | 'individual' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleZipDownload = async () => {
    setIsDownloading('zip');
    try {
      await downloadAllAsZip(images);
    } catch (error) {
      console.error('ZIP 다운로드 실패:', error);
    } finally {
      setIsDownloading(null);
      setIsOpen(false);
    }
  };

  const handleIndividualDownload = async () => {
    setIsDownloading('individual');
    try {
      await downloadAllIndividually(images);
    } catch (error) {
      console.error('개별 다운로드 실패:', error);
    } finally {
      setIsDownloading(null);
      setIsOpen(false);
    }
  };

  const isDisabled = disabled || images.length === 0;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`
          flex items-center gap-2 py-2.5 px-4 rounded-xl
          bg-white/10 hover:bg-white/20 border border-white/10
          text-white font-medium transition-all
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <Download size={18} />
        <span className="hidden sm:inline">전체 다운로드</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 py-2
                      bg-gray-900 border border-white/10 rounded-xl
                      shadow-2xl z-50"
        >
          <button
            onClick={handleZipDownload}
            disabled={isDownloading !== null}
            className="w-full flex items-center gap-3 px-4 py-3
                      text-left text-white hover:bg-white/10
                      transition-colors disabled:opacity-50"
          >
            {isDownloading === 'zip' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Archive size={18} className="text-indigo-400" />
            )}
            <div>
              <p className="font-medium">ZIP 압축 다운로드</p>
              <p className="text-xs text-gray-400">하나의 압축 파일로 다운로드</p>
            </div>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={handleIndividualDownload}
            disabled={isDownloading !== null}
            className="w-full flex items-center gap-3 px-4 py-3
                      text-left text-white hover:bg-white/10
                      transition-colors disabled:opacity-50"
          >
            {isDownloading === 'individual' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Files size={18} className="text-purple-400" />
            )}
            <div>
              <p className="font-medium">개별 파일 다운로드</p>
              <p className="text-xs text-gray-400">9개 파일을 각각 다운로드</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
