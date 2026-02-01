import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { isValidImageFile } from '../utils/helpers';

interface ImageUploadProps {
  onImageUpload: (file: File, previewUrl: string) => void;
  uploadedImage: string | null;
  onClear: () => void;
  disabled?: boolean;
}

export function ImageUpload({
  onImageUpload,
  uploadedImage,
  onClear,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      if (!isValidImageFile(file)) {
        setError('지원하지 않는 파일 형식이거나 파일 크기가 너무 큽니다. (최대 10MB)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        onImageUpload(file, previewUrl);
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [disabled, handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {uploadedImage ? (
        <div className="relative group">
          <div className="relative rounded-2xl overflow-hidden bg-gray-900/50 border border-white/10">
            <img
              src={uploadedImage}
              alt="업로드된 캐릭터"
              className="w-full aspect-square object-contain"
            />
            {!disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-500
                         rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <p className="text-center text-sm text-gray-400 mt-3">
            캐릭터 이미지가 업로드되었습니다
          </p>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            upload-zone rounded-2xl p-8 flex flex-col items-center justify-center
            min-h-[280px] cursor-pointer
            ${isDragging ? 'dragging' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div
            className={`
            w-20 h-20 rounded-full flex items-center justify-center mb-4
            ${isDragging ? 'bg-indigo-500/30' : 'bg-indigo-500/20'}
            transition-all
          `}
          >
            {isDragging ? (
              <ImageIcon size={36} className="text-indigo-400" />
            ) : (
              <Upload size={36} className="text-indigo-400" />
            )}
          </div>

          <h3 className="text-lg font-medium text-white mb-2">
            {isDragging ? '여기에 놓으세요' : '캐릭터 이미지 업로드'}
          </h3>

          <p className="text-sm text-gray-400 text-center">
            드래그 앤 드롭 또는 클릭하여 업로드
            <br />
            <span className="text-xs">PNG, JPG, GIF, WebP (최대 10MB)</span>
          </p>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
