import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { GeneratedImage } from '../types';

// 타임스탬프 생성
function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

// 파일명 정리 (특수문자 제거)
function sanitizeFileName(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
}

// 개별 이미지 다운로드
export async function downloadSingleImage(image: GeneratedImage): Promise<void> {
  const timestamp = getTimestamp();
  const fileName = `${sanitizeFileName(image.promptKo)}_${timestamp}.png`;

  try {
    // URL에서 blob 가져오기
    const response = await fetch(image.url);
    const blob = await response.blob();
    saveAs(blob, fileName);
  } catch (error) {
    console.error('이미지 다운로드 실패:', error);
    throw new Error('이미지 다운로드에 실패했습니다.');
  }
}

// 전체 이미지 ZIP 다운로드
export async function downloadAllAsZip(images: GeneratedImage[]): Promise<void> {
  const zip = new JSZip();
  const timestamp = getTimestamp();
  const folder = zip.folder('character_studio_images');

  if (!folder) {
    throw new Error('ZIP 폴더 생성 실패');
  }

  // 모든 이미지를 ZIP에 추가
  const downloadPromises = images.map(async (image, index) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const fileName = `${String(index + 1).padStart(2, '0')}_${sanitizeFileName(image.promptKo)}.png`;
      folder.file(fileName, blob);
    } catch (error) {
      console.error(`이미지 ${index + 1} 다운로드 실패:`, error);
    }
  });

  await Promise.all(downloadPromises);

  // ZIP 파일 생성 및 다운로드
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `character_studio_${timestamp}.zip`);
}

// 전체 이미지 개별 다운로드 (순차적)
export async function downloadAllIndividually(images: GeneratedImage[]): Promise<void> {
  const timestamp = getTimestamp();

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const fileName = `${String(i + 1).padStart(2, '0')}_${sanitizeFileName(image.promptKo)}_${timestamp}.png`;

    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      saveAs(blob, fileName);

      // 브라우저가 다운로드를 처리할 시간을 주기 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`이미지 ${i + 1} 다운로드 실패:`, error);
    }
  }
}
