import { X } from 'lucide-react';
import type { FontMode, FontStyle } from '../../types';

interface FontSelectorProps {
  currentFont: FontStyle;
  onSelectFont: (font: FontStyle) => void;
  fontMode: FontMode;
  onSelectFontMode: (mode: FontMode) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isEmbedded?: boolean;
}

const fonts: Array<{ id: FontStyle; label: string; sample: string }> = [
  { id: 'kyokasho', label: 'Kyokasho', sample: 'あいうえお' },
  { id: 'mincho', label: 'Mincho', sample: 'あいうえお' },
  { id: 'gothic', label: 'Gothic', sample: 'あいうえお' },
];

const fontFamilies: Record<FontStyle, string> = {
  kyokasho: '"Klee One", "Noto Sans JP", sans-serif',
  mincho: '"Shippori Mincho", serif',
  gothic: '"Zen Maru Gothic", sans-serif',
};

export function FontSelector({
  currentFont,
  onSelectFont,
  fontMode,
  onSelectFontMode,
  isOpen = true,
  onClose,
  isEmbedded = false,
}: FontSelectorProps) {
  if (!isEmbedded && !isOpen) {
    return null;
  }

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Choose Font</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Switch the study feel instantly.</p>
        </div>
        {!isEmbedded && onClose ? (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {fonts.map((font) => {
          const active = currentFont === font.id;
          return (
            <button
              key={font.id}
              onClick={() => onSelectFont(font.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                active
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 ring-2 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="text-sm font-bold text-slate-900 dark:text-white">{font.label}</div>
              <div
                className="mt-2 text-2xl"
                style={{ fontFamily: fontFamilies[font.id] }}
              >
                {font.sample}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onSelectFontMode('selected')}
          className={`rounded-xl px-3 py-2 text-sm font-bold border transition-all ${
            fontMode === 'selected'
              ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200'
              : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
          }`}
        >
          Selected
        </button>
        <button
          onClick={() => onSelectFontMode('random')}
          className={`rounded-xl px-3 py-2 text-sm font-bold border transition-all ${
            fontMode === 'random'
              ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200'
              : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
          }`}
        >
          Random
        </button>
      </div>
    </div>
  );

  if (isEmbedded) {
    return (
      <section className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        {content}
      </section>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6">
        {content}
      </div>
    </div>
  );
}
