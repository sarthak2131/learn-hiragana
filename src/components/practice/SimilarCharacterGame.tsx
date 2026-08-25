import { useMemo, useState } from 'react';
import { Play, Shuffle } from 'lucide-react';
import { SIMILAR_CHARACTER_PAIRS } from '../../data/similarCharacters';
import type { FontStyle } from '../../types';

interface SimilarCharacterGameProps {
  currentFont: FontStyle;
  selectedRowIds?: string[];
  onChangeFont: (font: FontStyle) => void;
  onPlayAudio: (text: string) => void;
  onFinish: () => void;
}

const fontFamilies: Record<FontStyle, string> = {
  kyokasho: '"Klee One", "Noto Sans JP", sans-serif',
  mincho: '"Shippori Mincho", serif',
  gothic: '"Zen Maru Gothic", sans-serif',
};

export function SimilarCharacterGame({
  currentFont,
  selectedRowIds = [],
  onChangeFont,
  onPlayAudio,
  onFinish,
}: SimilarCharacterGameProps) {
  const [index, setIndex] = useState(0);

  const availablePairs = useMemo(() => {
    if (!selectedRowIds || selectedRowIds.length === 0) return SIMILAR_CHARACTER_PAIRS;
    const filtered = SIMILAR_CHARACTER_PAIRS.filter(
      p => (p.char1 && selectedRowIds.includes(p.char1.row)) || (p.char2 && selectedRowIds.includes(p.char2.row))
    );
    return filtered.length > 0 ? filtered : SIMILAR_CHARACTER_PAIRS;
  }, [selectedRowIds]);

  const pair = useMemo(() => availablePairs[index % availablePairs.length], [availablePairs, index]);

  return (
    <section className="rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Spot the Difference</div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Compare two similar characters</h3>
        </div>
        <button
          onClick={() => onPlayAudio(pair.char1.romanization)}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-200 px-3 py-2 text-sm font-bold"
        >
          <Play className="w-4 h-4" />
          Play
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 text-center">
          <div className="text-7xl font-black text-slate-900 dark:text-white" style={{ fontFamily: fontFamilies[currentFont] }}>
            {pair.char1.character}
          </div>
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{pair.char1.romanization}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 text-center">
          <div className="text-7xl font-black text-slate-900 dark:text-white" style={{ fontFamily: fontFamilies[currentFont] }}>
            {pair.char2.character}
          </div>
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{pair.char2.romanization}</div>
        </div>
      </div>

      <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4 text-sm text-amber-900 dark:text-amber-100">
        {pair.note}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setIndex((prev) => (prev + 1) % SIMILAR_CHARACTER_PAIRS.length)}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-bold inline-flex items-center justify-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Next Pair
        </button>
        <button
          onClick={onFinish}
          className="rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 text-sm font-bold"
        >
          Finish Challenge
        </button>
        <div className="flex gap-2 sm:ml-auto">
          {(['kyokasho', 'mincho', 'gothic'] as FontStyle[]).map((font) => (
            <button
              key={font}
              onClick={() => onChangeFont(font)}
              className={`rounded-xl px-3 py-2 text-xs font-bold border ${
                currentFont === font
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              {font}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
