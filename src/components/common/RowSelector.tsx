import { Check, Square } from 'lucide-react';
import { HIRAGANA_ROWS } from '../../data/hiraganaData';
import type { FontStyle } from '../../types';

interface RowSelectorProps {
  selectedRowIds: string[];
  onToggleRow: (rowId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  currentFont: FontStyle;
}

export function RowSelector({
  selectedRowIds,
  onToggleRow,
  onSelectAll,
  onClearAll,
  currentFont,
}: RowSelectorProps) {
  return (
    <section className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Choose Rows</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Select the kana sets you want to study.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs font-bold"
          >
            All
          </button>
          <button
            onClick={onClearAll}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs font-bold"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {HIRAGANA_ROWS.map((row) => {
          const selected = selectedRowIds.includes(row.id);
          return (
            <button
              key={row.id}
              onClick={() => onToggleRow(row.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                selected
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 ring-2 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    Row {row.name}
                  </div>
                  <div className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{row.label}</div>
                </div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selected ? 'bg-rose-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                  {selected ? <Check className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-500 dark:text-slate-400" style={{ fontFamily: currentFont }}>
                {row.characters.map((char) => char.character).join(' ')}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
