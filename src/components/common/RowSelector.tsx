import React from 'react';
import { Check, Volume2 } from 'lucide-react';
import { HIRAGANA_ROWS } from '../../data/hiraganaData';
import type { FontStyle } from '../../types';

interface RowSelectorProps {
  selectedRowIds: string[];
  onToggleRow: (rowId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  currentFont: FontStyle;
  onPlayAudio?: (text: string) => void;
}

export function RowSelector({
  selectedRowIds,
  onToggleRow,
  onSelectAll,
  onClearAll,
  currentFont,
  onPlayAudio,
}: RowSelectorProps) {

  const handlePlayRowAudio = (e: React.MouseEvent, chars: string[]) => {
    e.stopPropagation();
    if (onPlayAudio && chars.length > 0) {
      onPlayAudio(chars[0]);
    }
  };

  return (
    <section className="bg-[#FFFDF8] rounded-2xl p-5 sm:p-6 border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] space-y-4 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-[#30312F]">Select Character Rows</h3>
          <p className="text-xs text-[#6F716C]">Select the kana sets you want to study ({selectedRowIds.length} active).</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={onSelectAll}
            className="px-2.5 py-1 rounded-lg bg-[#F4F1E9] border border-[#DDD7CB] text-[#30312F] hover:border-[#8B9B7A] transition-all"
          >
            All (16)
          </button>
          <button
            onClick={() => {
              onClearAll();
              ['G', 'Z', 'D', 'B'].forEach(id => onToggleRow(id));
            }}
            className="px-2.5 py-1 rounded-lg bg-[#E5EBDD] border border-[#CCD6C2] text-[#66765B] font-black hover:scale-105 transition-all"
          >
            + Dakuon ゛ (4)
          </button>
          <button
            onClick={() => {
              onClearAll();
              ['P'].forEach(id => onToggleRow(id));
            }}
            className="px-2.5 py-1 rounded-lg bg-[#E5EBDD] border border-[#CCD6C2] text-[#66765B] font-black hover:scale-105 transition-all"
          >
            + Handakuten ゜ (1)
          </button>
          <button
            onClick={onClearAll}
            className="px-2 py-1 text-[#96978F] hover:underline"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-5">
        
        {/* Basic Gojūon */}
        <div className="space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#96978F] pb-1 border-b border-[#E6E0D4]">
            Basic Hiragana (Gojūon — 11 Sets)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HIRAGANA_ROWS.filter(r => ['A','K','S','T','N','H','M','Y','R','W','N_SOLO'].includes(r.id)).map((row) => {
              const selected = selectedRowIds.includes(row.id);
              return (
                <div
                  key={row.id}
                  onClick={() => onToggleRow(row.id)}
                  className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[140px] cursor-pointer group shadow-[0_4px_18px_rgba(48,49,47,0.06)] relative ${
                    selected
                      ? 'bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#30312F]'
                      : 'bg-[#FFFDF8] border border-[#E6E0D4] text-[#6F716C] hover:border-[#B7C4AA] hover:bg-[#FEFCF7]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#66765B]">ROW {row.name}</span>
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                      selected ? 'bg-[#66765B] border-[#66765B] text-[#FFFDF8]' : 'border-[#DDD7CB] bg-[#FFFDF8]'
                    }`}>
                      {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="text-2xl font-black text-[#30312F] tracking-wide my-1" style={{ fontFamily: currentFont }}>
                    {row.characters.map(c => c.character).join(' ')}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E6E0D4]/60">
                    <span className="text-xs font-mono text-[#6F716C]">
                      {row.characters.map(c => c.romanization).join('  ')}
                    </span>

                    <button
                      onClick={(e) => handlePlayRowAudio(e, row.characters.map(c => c.character))}
                      className="w-9 h-9 rounded-full bg-[#F4F1E9] hover:bg-[#E5EBDD] text-[#66765B] flex items-center justify-center border border-[#DDD7CB] transition-colors"
                      title="Listen to Row Audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dakuon (゛) */}
        <div className="space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#66765B] pb-1 border-b border-[#E6E0D4]">
            Dakuon (Voiced Sounds ゛ — 4 Sets: G, Z, D, B)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HIRAGANA_ROWS.filter(r => ['G','Z','D','B'].includes(r.id)).map((row) => {
              const selected = selectedRowIds.includes(row.id);
              return (
                <div
                  key={row.id}
                  onClick={() => onToggleRow(row.id)}
                  className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[140px] cursor-pointer group shadow-[0_4px_18px_rgba(48,49,47,0.06)] relative ${
                    selected
                      ? 'bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#30312F]'
                      : 'bg-[#FFFDF8] border border-[#E6E0D4] text-[#6F716C] hover:border-[#B7C4AA] hover:bg-[#FEFCF7]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#66765B]">ROW {row.name} (゛)</span>
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                      selected ? 'bg-[#66765B] border-[#66765B] text-[#FFFDF8]' : 'border-[#DDD7CB] bg-[#FFFDF8]'
                    }`}>
                      {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="text-2xl font-black text-[#30312F] tracking-wide my-1" style={{ fontFamily: currentFont }}>
                    {row.characters.map(c => c.character).join(' ')}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E6E0D4]/60">
                    <span className="text-xs font-mono text-[#6F716C]">
                      {row.characters.map(c => c.romanization).join('  ')}
                    </span>

                    <button
                      onClick={(e) => handlePlayRowAudio(e, row.characters.map(c => c.character))}
                      className="w-9 h-9 rounded-full bg-[#F4F1E9] hover:bg-[#E5EBDD] text-[#66765B] flex items-center justify-center border border-[#DDD7CB] transition-colors"
                      title="Listen to Row Audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Handakuten (゜) */}
        <div className="space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#66765B] pb-1 border-b border-[#E6E0D4]">
            Handakuten (Semi-Voiced Sounds ゜ — 1 Set: P)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HIRAGANA_ROWS.filter(r => ['P'].includes(r.id)).map((row) => {
              const selected = selectedRowIds.includes(row.id);
              return (
                <div
                  key={row.id}
                  onClick={() => onToggleRow(row.id)}
                  className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[140px] cursor-pointer group shadow-[0_4px_18px_rgba(48,49,47,0.06)] relative ${
                    selected
                      ? 'bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#30312F]'
                      : 'bg-[#FFFDF8] border border-[#E6E0D4] text-[#6F716C] hover:border-[#B7C4AA] hover:bg-[#FEFCF7]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#66765B]">ROW {row.name} (゜)</span>
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                      selected ? 'bg-[#66765B] border-[#66765B] text-[#FFFDF8]' : 'border-[#DDD7CB] bg-[#FFFDF8]'
                    }`}>
                      {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="text-2xl font-black text-[#30312F] tracking-wide my-1" style={{ fontFamily: currentFont }}>
                    {row.characters.map(c => c.character).join(' ')}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E6E0D4]/60">
                    <span className="text-xs font-mono text-[#6F716C]">
                      {row.characters.map(c => c.romanization).join('  ')}
                    </span>

                    <button
                      onClick={(e) => handlePlayRowAudio(e, row.characters.map(c => c.character))}
                      className="w-9 h-9 rounded-full bg-[#F4F1E9] hover:bg-[#E5EBDD] text-[#66765B] flex items-center justify-center border border-[#DDD7CB] transition-colors"
                      title="Listen to Row Audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
