import { Check } from 'lucide-react';
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
    <section className="bg-white dark:bg-[#111522] rounded-2xl p-5 sm:p-6 border border-[#D9DDF0] dark:border-[#252B40] shadow-xs space-y-4 transition-colors duration-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-[#151827] dark:text-[#F8FAFC]">Select Character Rows</h3>
          <p className="text-xs text-[#475069] dark:text-[#A8B0C2]">Select the kana sets you want to study ({selectedRowIds.length} active).</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={onSelectAll}
            className="text-[#4F46E5] dark:text-[#818CF8] hover:underline"
          >
            Select All
          </button>
          <span className="text-[#69738A] dark:text-[#343B58]">|</span>
          <button
            onClick={onClearAll}
            className="text-[#69738A] dark:text-[#737D94] hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {HIRAGANA_ROWS.map((row) => {
          const selected = selectedRowIds.includes(row.id);
          return (
            <button
              key={row.id}
              onClick={() => onToggleRow(row.id)}
              className={`p-3.5 rounded-xl transition-all text-left flex items-center justify-between ${
                selected
                  ? 'bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.08)] border-2 border-[#4F46E5] dark:border-[#6366F1] text-[#151827] dark:text-[#F8FAFC]'
                  : 'bg-[#F4F5FF] dark:bg-[#0D1120] border border-[#D9DDF0] dark:border-[#252B40] text-[#475069] dark:text-[#A8B0C2] hover:border-[#B8BDE0] dark:hover:border-[#343B58]'
              }`}
            >
              <div>
                <div className="text-[10px] font-extrabold uppercase text-[#69738A] dark:text-[#737D94]">ROW {row.name}</div>
                <div className="text-base font-bold text-[#151827] dark:text-[#F8FAFC] mt-0.5" style={{ fontFamily: currentFont }}>
                  {row.label}
                </div>
              </div>

              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                selected ? 'bg-[#4F46E5] dark:bg-[#6366F1] border-[#4F46E5] dark:border-[#6366F1] text-white' : 'border-[#D9DDF0] dark:border-[#343B58] bg-white dark:bg-[#0D1120]'
              }`}>
                {selected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
