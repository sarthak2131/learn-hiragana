import React, { useEffect } from 'react';
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[88vh] flex flex-col rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6 overflow-hidden animate-fadeIn">
        
        {/* Header - Fixed top */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Character Detail
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{character.character}</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {character.romanization} {character.exampleWord ? `· ${character.exampleWord}` : ''}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner Content - Scrollable on small mobile heights */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_0.8fr] gap-4">
            
            {/* Character Showcase & Font Picker */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 sm:p-5 flex flex-col items-center justify-center">
              <div
                className="text-7xl sm:text-8xl font-bold leading-none text-center py-2"
                style={{ fontFamily: fontFamilies[activeFont] }}
              >
                {character.character}
              </div>
              <div className="mt-3 flex justify-center gap-1.5 w-full">
                {(['kyokasho', 'mincho', 'gothic'] as FontStyle[]).map((font) => (
                  <button
                    key={font}
                    onClick={() => onChangeFont(font)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      activeFont === font
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-rose-400'
                    }`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats & Details */}
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Progress</div>
                <div className="mt-1.5 grid grid-cols-2 gap-2 text-xs">
                  <div>Attempts: <span className="font-bold">{progress.attempts}</span></div>
                  <div>Accuracy: <span className="font-bold">{progress.confidence}%</span></div>
                  <div>Streak: <span className="font-bold">{progress.streak}</span></div>
                  <div>Mastery: <span className="font-bold">{progress.mastery}</span></div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Example</div>
                <p className="mt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {character.exampleWord ?? 'Practice this character in context.'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {character.exampleMeaning ?? ''}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => onPlayAudio(character.romanization)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-transform"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Audio</span>
                </button>
                <button
                  onClick={() => onStartSinglePractice(character)}
                  className="flex-1 inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                >
                  Practice This
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

