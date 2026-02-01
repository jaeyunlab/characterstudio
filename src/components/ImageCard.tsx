import { useState } from 'react';
import { Download, ZoomIn, X } from 'lucide-react';
import type { GeneratedImage } from '../types';
import { downloadSingleImage } from '../utils/download';

interface ImageCardProps {
  image: GeneratedImage;
  index: number;
}

export function ImageCard({ image, index }: ImageCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      await downloadSingleImage(image);
    } catch (error) {
      console.error('다운로드 실패:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div
        className="image-card relative rounded-2xl overflow-hidden bg-gray-900/50
                   border border-white/10 cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        {/* 이미지 */}
        <div className="aspect-square overflow-hidden">
          <img
            src={image.url}
            alt={image.promptKo}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* 오버레이 */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* 하단 정보 */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4
                      transform translate-y-full group-hover:translate-y-0
                      transition-transform duration-300"
        >
          <p className="text-white text-sm font-medium mb-2 line-clamp-1">
            {image.promptKo}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3
                        bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm
                        transition-all disabled:opacity-50"
            >
              <Download size={16} />
              {isDownloading ? '다운로드 중...' : '다운로드'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white
                        transition-all"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        {/* 인덱스 배지 */}
        <div
          className="absolute top-3 left-3 w-8 h-8 rounded-full
                      bg-black/50 backdrop-blur-sm border border-white/20
                      flex items-center justify-center text-white text-sm font-medium"
        >
          {index + 1}
        </div>
      </div>

      {/* 확대 모달 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4
                      bg-black/90 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white
                        transition-colors"
            >
              <X size={24} />
            </button>

            <img
              src={image.url}
              alt={image.promptKo}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />

            <div className="mt-4 flex items-center justify-between">
              <p className="text-white text-lg">{image.promptKo}</p>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2 py-2 px-4
                          bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white
                          transition-all disabled:opacity-50"
              >
                <Download size={18} />
                {isDownloading ? '다운로드 중...' : '다운로드'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
