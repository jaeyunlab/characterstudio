import type { ImageTheme } from '../types';

// 다양한 포즈, 표정, 상황에 대한 주제 풀
export const imageThemes: ImageTheme[] = [
  // 표정
  { ko: "행복한 미소", en: "happy smile, cheerful bright expression, joyful mood" },
  { ko: "진지한 표정", en: "serious focused expression, determined look, intense gaze" },
  { ko: "놀란 표정", en: "surprised shocked expression, wide eyes, amazed look" },
  { ko: "슬픈 표정", en: "sad melancholic expression, tearful eyes, sorrowful mood" },
  { ko: "화난 표정", en: "angry fierce expression, furrowed brows, intense emotion" },
  { ko: "수줍은 표정", en: "shy bashful expression, blushing cheeks, timid look" },
  { ko: "장난스러운 표정", en: "playful mischievous expression, teasing smile, fun mood" },
  { ko: "자신감 넘치는 표정", en: "confident proud expression, self-assured look, bold stance" },

  // 포즈
  { ko: "점프하는 포즈", en: "jumping dynamic pose, mid-air action, energetic movement" },
  { ko: "앉아있는 모습", en: "sitting relaxed pose, comfortable position, casual sitting" },
  { ko: "달리는 모습", en: "running fast pose, speed motion, athletic movement" },
  { ko: "손 흔드는 모습", en: "waving hand greeting, friendly gesture, welcoming pose" },
  { ko: "생각하는 포즈", en: "thinking contemplative pose, hand on chin, pensive mood" },
  { ko: "춤추는 포즈", en: "dancing graceful pose, elegant movement, rhythmic motion" },
  { ko: "팔짱 낀 포즈", en: "arms crossed pose, confident stance, assertive posture" },
  { ko: "기지개 펴는 모습", en: "stretching pose, arms raised, relaxed awakening" },
  { ko: "피스 사인 포즈", en: "peace sign pose, V gesture, cute friendly pose" },
  { ko: "하트 포즈", en: "heart shape hands pose, love gesture, cute expression" },

  // 행동
  { ko: "책 읽는 모습", en: "reading a book, focused on literature, studious pose" },
  { ko: "음악 듣는 모습", en: "listening to music with headphones, enjoying melody, relaxed" },
  { ko: "커피 마시는 모습", en: "drinking coffee, holding cup, cozy warm moment" },
  { ko: "사진 찍는 모습", en: "taking a photo with camera, photographer pose, focused" },
  { ko: "그림 그리는 모습", en: "painting drawing art, creative artist pose, artistic" },
  { ko: "요리하는 모습", en: "cooking in kitchen, chef pose, culinary activity" },
  { ko: "운동하는 모습", en: "exercising workout, athletic pose, fitness activity" },
  { ko: "게임하는 모습", en: "playing video games, gamer pose, focused on screen" },

  // 배경/상황
  { ko: "벚꽃 배경", en: "cherry blossom background, spring scenery, pink petals falling" },
  { ko: "해변 배경", en: "beach ocean background, summer vibes, coastal scenery" },
  { ko: "도시 야경 배경", en: "city night skyline background, urban lights, modern setting" },
  { ko: "숲속 배경", en: "forest nature background, green trees, peaceful woodland" },
  { ko: "눈 내리는 배경", en: "snowy winter background, falling snowflakes, cold weather" },
  { ko: "별이 빛나는 밤", en: "starry night sky background, cosmic atmosphere, dreamy" },
  { ko: "카페 배경", en: "cozy cafe interior background, warm atmosphere, casual setting" },
  { ko: "학교 배경", en: "school classroom background, academic setting, student life" },

  // 의상/스타일
  { ko: "정장 차림", en: "formal business suit outfit, professional attire, elegant" },
  { ko: "캐주얼 복장", en: "casual everyday clothes, relaxed style, comfortable outfit" },
  { ko: "운동복 차림", en: "sportswear athletic outfit, gym clothes, active wear" },
  { ko: "파티 드레스", en: "party dress fancy outfit, glamorous attire, celebration" },
  { ko: "전통 의상", en: "traditional cultural costume, heritage outfit, classic attire" },
  { ko: "겨울 코트 차림", en: "winter coat warm outfit, cold weather attire, cozy clothes" },
];

// 랜덤으로 9개의 주제 선택
export function getRandomThemes(count: number = 9): ImageTheme[] {
  const shuffled = [...imageThemes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 주어진 주제들에서 중복 없이 선택
export function selectUniqueThemes(usedThemes: string[], count: number = 9): ImageTheme[] {
  const available = imageThemes.filter(theme => !usedThemes.includes(theme.ko));
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
