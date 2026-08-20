export interface VocabularyWord {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  emoji?: string;
  chars: string[];
}

export const VOCABULARY_WORDS: VocabularyWord[] = [
  { id: 'neko', japanese: 'ねこ', romaji: 'neko', english: 'Cat', emoji: '🐱', chars: ['ね', 'こ'] },
  { id: 'inu', japanese: 'いぬ', romaji: 'inu', english: 'Dog', emoji: '🐶', chars: ['い', 'ぬ'] },
  { id: 'sakana', japanese: 'さかな', romaji: 'sakana', english: 'Fish', emoji: '🐟', chars: ['さ', 'か', 'な'] },
  { id: 'kuruma', japanese: 'くるま', romaji: 'kuruma', english: 'Car', emoji: '🚗', chars: ['く', 'る', 'ま'] },
  { id: 'sakura', japanese: 'さくら', romaji: 'sakura', english: 'Cherry Blossom', emoji: '🌸', chars: ['さ', 'く', 'ら'] },
  { id: 'umi', japanese: 'うみ', romaji: 'umi', english: 'Sea / Ocean', emoji: '🌊', chars: ['う', 'み'] }
];
