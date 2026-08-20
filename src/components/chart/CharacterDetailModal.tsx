import { Play, X } from 'lucide-react';
import type { CharacterProgress, FontStyle, HiraganaCharacter } from '../../types';

interface CharacterDetailModalProps {
  character: HiraganaCharacter;
  activeFont: FontStyle;
  onChangeFont: (font: FontStyle) => void;
  progress: CharacterProgress;
  onClose: () => void;
  onPlayAudio: (text: string) => void;
  onStartSinglePractice: (character: HiraganaCharacter) => void;
}

const fontFamilies: Record<FontStyle, string> = {
  kyokasho: '"Klee One", "Noto Sans JP", sans-serif',
  mincho: '"Shippori Mincho", serif',
  gothic: '"Zen Maru Gothic", sans-serif',
};

export function CharacterDetailModal({
  character,
  activeFont,
  onChangeFont,
  progress,
  onClose,
  onPlayAudio,
  onStartSinglePractice,
}: CharacterDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Character Detail
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{character.character}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {character.romanization} {character.exampleWord ? `· ${character.exampleWord}` : ''}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_0.8fr] gap-4 mt-5">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5">
            <div
              className="text-7xl sm:text-8xl font-bold leading-none text-center"
              style={{ fontFamily: fontFamilies[activeFont] }}
            >
              {character.character}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {(['kyokasho', 'mincho', 'gothic'] as FontStyle[]).map((font) => (
                <button
                  key={font}
                  onClick={() => onChangeFont(font)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                    activeFont === font
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Progress</div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div>Attempts: <span className="font-bold">{progress.attempts}</span></div>
                <div>Accuracy: <span className="font-bold">{progress.confidence}%</span></div>
                <div>Streak: <span className="font-bold">{progress.streak}</span></div>
                <div>Mastery: <span className="font-bold">{progress.mastery}</span></div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Example</div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                {character.exampleWord ?? 'Practice this character in context.'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {character.exampleMeaning ?? ''}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onPlayAudio(character.romanization)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 text-sm font-bold"
              >
                <Play className="w-4 h-4" />
                Play Audio
              </button>
              <button
                onClick={() => onStartSinglePractice(character)}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
              >
                Practice This
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
