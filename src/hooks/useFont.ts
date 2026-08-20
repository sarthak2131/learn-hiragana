import { useLocalStorage } from './useLocalStorage';
import type { FontMode, FontStyle } from '../types/index';

export const FONT_CLASSES: Record<FontStyle, string> = {
  kyokasho: 'font-kyokasho',
  mincho: 'font-mincho',
  gothic: 'font-gothic'
};

export const FONT_DESCRIPTIONS: Record<FontStyle, { title: string; jpName: string; styleName: string; desc: string }> = {
  kyokasho: {
    title: 'Kyōkasho',
    jpName: '教科書体',
    styleName: 'Textbook style',
    desc: 'Textbook style — useful for learning handwriting shapes.'
  },
  mincho: {
    title: 'Minchō',
    jpName: '明朝体',
    styleName: 'Serif style',
    desc: 'Serif style — useful for recognizing Hiragana in printed Japanese.'
  },
  gothic: {
    title: 'Gothic',
    jpName: 'ゴシック体',
    styleName: 'Sans-serif style',
    desc: 'Clean modern sans-serif type common in modern digital UIs.'
  }
};

export function useFont() {
  const [font, setFont] = useLocalStorage<FontStyle>('hiragana_font', 'kyokasho');
  const [fontMode, setFontMode] = useLocalStorage<FontMode>('hiragana_font_mode', 'selected');

  return {
    font,
    setFont,
    fontMode,
    setFontMode,
    fontDetails: FONT_DESCRIPTIONS[font]
  };
}
