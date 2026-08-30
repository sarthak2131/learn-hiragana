import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { FontStyle, HiraganaCharacter } from '../types';
import { HIRAGANA_ROWS } from '../data/hiraganaData';
import { Volume2, Sparkles, Zap, Type, Search } from 'lucide-react';

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

const fontLabels: Record<FontStyle, string> = {
  kyokasho: 'Kyōkasho',
  mincho: 'Minchō',
  gothic: 'Gothic',
};

type FilterCategory = 'all' | 'basic' | 'dakuon' | 'handakuten';

export function ChartPage({ activeFont, onChangeFont, onSelectCharacter, onPlayAudio }: ChartPageProps) {
  const [playingRowId, setPlayingRowId] = useState<string | null>(null);
  const [activeChar, setActiveChar] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const playbackIdRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      playbackIdRef.current += 1;
    };
  }, []);

  const handlePlayFullRow = async (rowId: string, chars: HiraganaCharacter[]) => {
    if (playingRowId === rowId) {
      playbackIdRef.current += 1;
      setPlayingRowId(null);
      setActiveChar(null);
      return;
    }

    playbackIdRef.current += 1;
    const currentId = playbackIdRef.current;
    setPlayingRowId(rowId);

    try {
      for (let i = 0; i < chars.length; i++) {
        if (playbackIdRef.current !== currentId) {
          return;
        }

        const c = chars[i];
        setActiveChar(c.character);
        await Promise.resolve(onPlayAudio(c.character, audioSpeed));

        if (playbackIdRef.current !== currentId || i === chars.length - 1) {
          continue;
        }

        await new Promise((resolve) => setTimeout(resolve, Math.max(90, Math.round(140 / audioSpeed))));
      }
    } finally {
      if (playbackIdRef.current === currentId) {
        setPlayingRowId(null);
        setActiveChar(null);
      }
    }
  };

  const handleCharacterClick = (char: HiraganaCharacter) => {
    playbackIdRef.current += 1;
    setPlayingRowId(null);
    setActiveChar(char.character);
    onSelectCharacter(char.character);
    onPlayAudio(char.character, audioSpeed);
  };

  const filteredRows = useMemo(() => {
    return HIRAGANA_ROWS.filter(row => {
      if (activeCategory === 'basic' && ['G', 'Z', 'D', 'B', 'P'].includes(row.id)) return false;
      if (activeCategory === 'dakuon' && !['G', 'Z', 'D', 'B'].includes(row.id)) return false;
      if (activeCategory === 'handakuten' && row.id !== 'P') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesRow = row.name.toLowerCase().includes(q) || row.label.includes(q);
        const matchesChar = row.characters.some(c => c.character.includes(q) || c.romanization.toLowerCase().includes(q));
        return matchesRow || matchesChar;
      }

      return true;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 animate-pageTransition">
      
      {/* Header & Controls Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#FFFDF8] p-5 sm:p-6 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] transition-colors duration-200">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#66765B] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HIRAGANA REFERENCE</span>
          </div>
          <h2 className="text-2xl font-black text-[#30312F] mt-1">
            Browse all 71 Hiragana characters
          </h2>
          <p className="text-xs text-[#6F716C] mt-0.5">
            Tap a character or click "Play Row". Adjust audio speed or font below.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#96978F]" />
            <input
              type="text"
              placeholder="Search (e.g. ka, さ)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#DDD7CB] bg-[#FFFDF8] text-xs font-bold text-[#30312F] focus:outline-none focus:ring-2 focus:ring-[#8B9B7A]"
            />
          </div>

          {/* Audio Speed Segmented Control */}
          <div className="flex items-center gap-1 bg-[#F4F1E9] p-1.5 rounded-xl border border-[#DDD7CB]">
            <div className="flex items-center gap-1 px-1 text-xs font-bold text-[#6F716C]">
              <Zap className="w-3.5 h-3.5 text-[#D9AE58]" />
              <span>Speed:</span>
            </div>

            {[0.5, 1.0, 1.5, 2.0, 3.0].map((spd) => (
              <button
                key={spd}
                onClick={() => setAudioSpeed(spd)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  audioSpeed === spd
                    ? 'bg-[#8B9B7A] text-[#FFFDF8] shadow-xs'
                    : 'text-[#6F716C] hover:text-[#30312F]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Font Style Segmented Control */}
          <div className="flex items-center gap-1 bg-[#F4F1E9] p-1.5 rounded-xl border border-[#DDD7CB]">
            <Type className="w-3.5 h-3.5 text-[#66765B] ml-1" />
            {(['kyokasho', 'mincho', 'gothic'] as FontStyle[]).map((font) => (
              <button
                key={font}
                onClick={() => onChangeFont(font)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeFont === font
                    ? 'bg-[#8B9B7A] text-[#FFFDF8] shadow-xs'
                    : 'text-[#6F716C] hover:text-[#30312F]'
                }`}
              >
                {fontLabels[font]}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'all', label: 'All Sets (71)' },
          { id: 'basic', label: 'Basic (Gojūon)' },
          { id: 'dakuon', label: 'Dakuon (゛)' },
          { id: 'handakuten', label: 'Handakuten (゜)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as FilterCategory)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold shrink-0 transition-all border ${
              activeCategory === cat.id
                ? 'bg-[#E5EBDD] text-[#66765B] border-[#CCD6C2] shadow-xs'
                : 'bg-[#FFFDF8] border-[#E6E0D4] text-[#6F716C] hover:border-[#8B9B7A]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Compact Hiragana Rows Reference Grid */}
      <div className="space-y-4">
        {filteredRows.map((row) => {
          const isRowPlaying = playingRowId === row.id;

          return (
            <section 
              key={row.id} 
              className={`rounded-2xl bg-[#FFFDF8] border p-4 sm:p-5 transition-all shadow-[0_4px_18px_rgba(48,49,47,0.06)] ${
                isRowPlaying
                  ? 'border-[#8B9B7A] ring-2 ring-[#8B9B7A]/20'
                  : 'border-[#E6E0D4]'
              }`}
            >
              
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E6E0D4]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-widest text-[#96978F]">
                    ROW {row.name}
                  </span>
                  <span className="text-sm font-bold text-[#30312F]" style={{ fontFamily: fontFamilies[activeFont] }}>
                    {row.label}
                  </span>
                </div>

                <button
                  onClick={() => handlePlayFullRow(row.id, row.characters)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    isRowPlaying
                      ? 'bg-[#8B9B7A] text-[#FFFDF8] shadow-xs'
                      : 'bg-[#E5EBDD] hover:bg-[#DCE4D4] text-[#66765B] border border-[#CCD6C2]'
                  }`}
                  title={`Play all characters in Row ${row.name}`}
                >
                  {isRowPlaying ? (
                    <div className="flex items-end gap-0.5 h-3">
                      <div className="w-1 bg-[#FFFDF8] rounded-full animate-equalizer-1" />
                      <div className="w-1 bg-[#FFFDF8] rounded-full animate-equalizer-2" />
                      <div className="w-1 bg-[#FFFDF8] rounded-full animate-equalizer-3" />
                    </div>
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#66765B]" />
                  )}
                  <span>{isRowPlaying ? `Playing Row ${row.name}...` : `Play Row`}</span>
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {row.characters.map((char) => {
                  const isCharActive = activeChar === char.character;

                  return (
                    <button
                      key={char.id}
                      onClick={() => handleCharacterClick(char)}
                      className={`h-[76px] rounded-xl border flex flex-col items-center justify-center transition-all duration-200 group outline-none ${
                        isCharActive
                          ? 'bg-[#F1F5ED] border-[#8B9B7A] text-[#66765B] shadow-xs ring-2 ring-[#8B9B7A]/30 scale-[1.03]'
                          : 'bg-[#FFFDF8] border-[#E6E0D4] text-[#30312F] hover:border-[#B7C4AA] hover:bg-[#FEFCF7] hover:-translate-y-0.5 shadow-xs'
                      }`}
                      style={{ fontFamily: fontFamilies[activeFont] }}
                    >
                      <span className="text-[36px] font-bold group-hover:scale-105 transition-transform leading-none">{char.character}</span>
                      <span className={`text-[11px] font-bold mt-1 ${isCharActive ? 'text-[#66765B]' : 'text-[#6F716C] group-hover:text-[#66765B]'}`}>
                        {char.romanization}
                      </span>
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
