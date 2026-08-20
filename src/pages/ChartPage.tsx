import type { FontStyle } from '../types';
import { HIRAGANA_ROWS } from '../data/hiraganaData';

interface ChartPageProps {
  activeFont: FontStyle;
  onChangeFont: (font: FontStyle) => void;
  onSelectCharacter: (char: string) => void;
  onPlayAudio: (text: string) => void;
}

const fontFamilies: Record<FontStyle, string> = {
  kyokasho: '"Klee One", "Noto Sans JP", sans-serif',
  mincho: '"Shippori Mincho", serif',
  gothic: '"Zen Maru Gothic", sans-serif',
};

export function ChartPage({ activeFont, onChangeFont, onSelectCharacter, onPlayAudio }: ChartPageProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Hiragana Chart</div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Browse and tap any character</h2>
        </div>
        <div className="flex gap-2">
          {(['kyokasho', 'mincho', 'gothic'] as FontStyle[]).map((font) => (
            <button
              key={font}
              onClick={() => onChangeFont(font)}
              className={`rounded-xl px-3 py-2 text-xs font-bold border ${
                activeFont === font
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white dark:bg-[#151c2c] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {HIRAGANA_ROWS.map((row) => (
          <section key={row.id} className="rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{row.label}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Row {row.name}</div>
              </div>
              <div className="text-sm text-slate-400" style={{ fontFamily: fontFamilies[activeFont] }}>
                {row.characters.map((char) => char.character).join('  ')}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {row.characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => {
                    onSelectCharacter(char.character);
                    onPlayAudio(char.romanization);
                  }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 text-center hover:border-rose-400 transition-colors"
                  style={{ fontFamily: fontFamilies[activeFont] }}
                >
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{char.character}</div>
                  <div className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{char.romanization}</div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
