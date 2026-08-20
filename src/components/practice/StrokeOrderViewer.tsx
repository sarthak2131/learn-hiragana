import { Play, X } from 'lucide-react';
import type { FontStyle, HiraganaCharacter } from '../../types';

interface StrokeOrderViewerProps {
  character: HiraganaCharacter;
  activeFont: FontStyle;
  onClose: () => void;
  onPlayAudio: (text: string) => void;
}

const fontFamilies: Record<FontStyle, string> = {
  kyokasho: '"Klee One", "Noto Sans JP", sans-serif',
  mincho: '"Shippori Mincho", serif',
  gothic: '"Zen Maru Gothic", sans-serif',
};

export function StrokeOrderViewer({ character, activeFont, onClose, onPlayAudio }: StrokeOrderViewerProps) {
  return (
    <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Stroke Guide</div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{character.character}</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 text-center">
        <div className="text-8xl font-black text-slate-900 dark:text-white" style={{ fontFamily: fontFamilies[activeFont] }}>
          {character.character}
        </div>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          This simplified viewer is ready for a future stroke animation or step-by-step overlay.
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={() => onPlayAudio(character.romanization)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 text-sm font-bold"
        >
          <Play className="w-4 h-4" />
          Play
        </button>
        <button onClick={onClose} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2 text-sm font-bold">
          Close
        </button>
      </div>
    </div>
  );
}
