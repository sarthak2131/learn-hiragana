import { SimilarPair } from '../types/index';
import { getCharacterByChar } from './hiraganaData';

export const SIMILAR_CHARACTER_PAIRS: SimilarPair[] = [
  {
    id: 'sa-ki',
    char1: getCharacterByChar('さ')!,
    char2: getCharacterByChar('き')!,
    note: 'き (ki) has 2 horizontal bars at top, while さ (sa) has only 1 horizontal bar.'
  },
  {
    id: 'shi-tsu',
    char1: getCharacterByChar('し')!,
    char2: getCharacterByChar('つ')!,
    note: 'し (shi) curves vertically downwards then up, whereas つ (tsu) is a horizontal curve pointing right.'
  },
  {
    id: 'chi-sa',
    char1: getCharacterByChar('ち')!,
    char2: getCharacterByChar('さ')!,
    note: 'ち (chi) curves to the right like a 5, while さ (sa) curves back to the left.'
  },
  {
    id: 'nu-me',
    char1: getCharacterByChar('ぬ')!,
    char2: getCharacterByChar('め')!,
    note: 'ぬ (nu) has a small loop at the bottom-right tail, while め (me) has no loop at the end.'
  },
  {
    id: 'ne-re',
    char1: getCharacterByChar('ね')!,
    char2: getCharacterByChar('れ')!,
    note: 'ね (ne) ends with a looped tail, whereas れ (re) curves outward to the right with no loop.'
  },
  {
    id: 'wa-ne',
    char1: getCharacterByChar('わ')!,
    char2: getCharacterByChar('ね')!,
    note: 'わ (wa) has an open smooth back, while ね (ne) curls into a loop at the bottom right.'
  },
  {
    id: 'a-o',
    char1: getCharacterByChar('あ')!,
    char2: getCharacterByChar('お')!,
    note: 'お (o) includes a small accent dash at top right and wraps rounder than あ (a).'
  },
  {
    id: 'ru-ro',
    char1: getCharacterByChar('る')!,
    char2: getCharacterByChar('ろ')!,
    note: 'る (ru) finishes with a small inner loop at the end, while ろ (ro) leaves the tail open.'
  },
  {
    id: 'ha-ho',
    char1: getCharacterByChar('は')!,
    char2: getCharacterByChar('ほ')!,
    note: 'ほ (ho) has a top horizontal bar over the right vertical line, while は (ha) has no top bar cap.'
  },
  {
    id: 'ma-mo',
    char1: getCharacterByChar('ま')!,
    char2: getCharacterByChar('も')!,
    note: 'ま (ma) has a straight left stem, whereas も (mo) starts with a vertical hook passing through 2 crossbars.'
  }
];
