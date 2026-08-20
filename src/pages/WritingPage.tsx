import type { FontStyle, HiraganaCharacter } from '../types';
import { HIRAGANA_ROWS } from '../data/hiraganaData';
import { Play } from 'lucide-react';

interface WritingPageProps {
  activeFont: FontStyle;
  onPlayAudio: (text: string) => void;
  onStartWritingPractice: (character: HiraganaCharacter) => void;
}

const fontFamilies: Record<FontStyle, string> = {
  kyokasho: '"Klee One", "Noto Sans JP", sans-serif',
  mincho: '"Shippori Mincho", serif',
  gothic: '"Zen Maru Gothic", sans-serif',
};

export function WritingPage({ activeFont, onPlayAudio, onStartWritingPractice }: WritingPageProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 animate-fadeIn">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Writing Practice</div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Study stroke rhythm and shape memory</h2>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HIRAGANA_ROWS.flatMap((row) => row.characters).slice(0, 18).map((char) => (
          <button
            key={char.id}
            onClick={() => onStartWritingPractice(char)}
            className="rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-5 text-left shadow-sm hover:-translate-y-0.5 transition-transform"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{char.romanization}</div>
                <div className="mt-2 text-5xl font-black text-slate-900 dark:text-white" style={{ fontFamily: fontFamilies[activeFont] }}>
                  {char.character}
                </div>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onPlayAudio(char.romanization);
                }}
                className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              {char.exampleWord ?? 'Tap to start handwriting practice.'}
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}
