import React, { useState } from 'react';
import type { FontStyle, HiraganaCharacter } from '../types';
import { HIRAGANA_ROWS } from '../data/hiraganaData';
import { Volume2, Sparkles, Zap } from 'lucide-react';

interface ChartPageProps {
  activeFont: FontStyle;
  onChangeFont: (font: FontStyle) => void;
  onSelectCharacter: (char: string) => void;
  onPlayAudio: (text: string, speed?: number) => void;
}

const fontFamilies: Record<FontStyle, string> = {
  kyokasho: '"Klee One", "Noto Sans JP", sans-serif',
  mincho: '"Shippori Mincho", serif',
  gothic: '"Zen Maru Gothic", sans-serif',
};

export function ChartPage({ activeFont, onChangeFont, onSelectCharacter, onPlayAudio }: ChartPageProps) {
  const [playingRowId, setPlayingRowId] = useState<string | null>(null);
  const [activeChar, setActiveChar] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0); // Default 1.0x

  // Smooth sequential row playback with zero lag
  const handlePlayFullRow = async (rowId: string, chars: HiraganaCharacter[]) => {
    if (playingRowId === rowId) {
      setPlayingRowId(null);
      setActiveChar(null);
      return;
    }

    setPlayingRowId(rowId);

    // Smooth delay scaling from 0.5x up to 3.0x
    const stepDelay = Math.max(220, Math.round(650 / audioSpeed));

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      setActiveChar(c.character);
      onPlayAudio(c.character, audioSpeed);

      await new Promise((resolve) => setTimeout(resolve, stepDelay));
    }

    setPlayingRowId(null);
    setActiveChar(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 animate-fadeIn">
      
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white dark:bg-[#151c2c] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hiragana Reference Chart</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Browse and tap any character
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tap a character or click "Play Full Row". Adjust playback speed up to 3x below.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Audio Speed Selector up to 3x */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 px-2 text-xs font-extrabold text-slate-600 dark:text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Speed:</span>
            </div>

            {[0.5, 1.0, 1.5, 2.0, 3.0].map((spd) => (
              <button
                key={spd}
                onClick={() => setAudioSpeed(spd)}
                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all ${
                  audioSpeed === spd
                    ? 'bg-rose-600 text-white shadow-xs scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Font Style Selectors */}
          <div className="flex gap-1.5">
            {(['kyokasho', 'mincho', 'gothic'] as FontStyle[]).map((font) => (
              <button
                key={font}
                onClick={() => onChangeFont(font)}
                className={`rounded-xl px-3 py-1.5 text-xs font-extrabold border transition-all ${
                  activeFont === font
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-rose-400'
                }`}
              >
                {font}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Hiragana Rows List */}
      <div className="space-y-5">
        {HIRAGANA_ROWS.map((row) => {
          const isRowPlaying = playingRowId === row.id;

          return (
            <section 
              key={row.id} 
              className={`rounded-3xl bg-white dark:bg-[#151c2c] border p-5 sm:p-6 shadow-sm transition-all ${
                isRowPlaying
                  ? 'border-rose-500 dark:border-rose-500 ring-4 ring-rose-500/10 shadow-lg'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              
              {/* Row Header & Play Full Row Button */}
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    Row {row.name}
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5" style={{ fontFamily: fontFamilies[activeFont] }}>
                    {row.label}
                  </div>
                </div>

                {/* Play Full Row Button */}
                <button
                  onClick={() => handlePlayFullRow(row.id, row.characters)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition-all ${
                    isRowPlaying
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30 scale-105'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                  }`}
                  title={`Play all characters in Row ${row.name}`}
                >
                  <Volume2 className={`w-4 h-4 ${isRowPlaying ? 'animate-pulse text-white' : 'text-rose-500'}`} />
                  <span>{isRowPlaying ? `Playing Row ${row.name} (${audioSpeed}x)...` : `Play Full Row (${row.name})`}</span>
                </button>
              </div>

              {/* Grid of Characters in Row */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {row.characters.map((char) => {
                  const isCharActive = activeChar === char.character;

                  return (
                    <button
                      key={char.id}
                      onClick={() => {
                        onSelectCharacter(char.character);
                        onPlayAudio(char.character, audioSpeed);
                      }}
                      className={`rounded-2xl border-2 p-4 text-center transition-all group ${
                        isCharActive
                          ? 'bg-rose-500 text-white border-rose-500 scale-105 shadow-lg ring-4 ring-rose-500/20'
                          : 'bg-slate-50 dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-rose-400 dark:hover:border-rose-600 hover:scale-[1.02]'
                      }`}
                      style={{ fontFamily: fontFamilies[activeFont] }}
                    >
                      <div className="text-3xl sm:text-4xl font-extrabold">{char.character}</div>
                      <div className={`mt-1 text-xs font-bold ${isCharActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-500'}`}>
                        {char.romanization}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

    </div>
  );
}
