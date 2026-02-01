import type { GeneratedImage } from '../types';
import { ImageCard } from './ImageCard';
import { ImagePlaceholder } from './ImagePlaceholder';

interface ImageGridProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  progress?: {
    current: number;
    total: number;
  };
}

export function ImageGrid({ images, isGenerating, progress }: ImageGridProps) {
  const totalSlots = 9;
  const filledSlots = images.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {/* 생성된 이미지 */}
      {images.map((image, index) => (
        <ImageCard key={image.id} image={image} index={index} />
      ))}

      {/* 플레이스홀더 */}
      {Array.from({ length: totalSlots - filledSlots }).map((_, index) => {
        const slotIndex = filledSlots + index;
        const isCurrentlyGenerating =
          isGenerating && progress && slotIndex === progress.current;

        return (
          <ImagePlaceholder
            key={`placeholder-${slotIndex}`}
            index={slotIndex}
            isGenerating={isCurrentlyGenerating}
          />
        );
      })}
    </div>
  );
}
