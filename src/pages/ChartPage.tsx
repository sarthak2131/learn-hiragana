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

  // Cancellation token ID to prevent overlapping row playback loops
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white dark:bg-[#111522] p-5 sm:p-6 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xs transition-colors duration-200">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5] dark:text-[#818CF8] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HIRAGANA REFERENCE</span>
          </div>
          <h2 className="text-2xl font-black text-[#151827] dark:text-[#F8FAFC] mt-1">
            Browse all Hiragana characters
          </h2>
          <p className="text-xs text-[#475069] dark:text-[#A8B0C2] mt-0.5">
            Tap a character or click "Play Row". Adjust audio speed or font below.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#69738A] dark:text-[#737D94]" />
            <input
              type="text"
              placeholder="Search (e.g. ka, さ)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#D9DDF0] dark:border-[#252B40] bg-[#F4F5FF] dark:bg-[#0D1120] text-xs font-bold text-[#151827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            />
          </div>

          {/* Audio Speed Segmented Control */}
          <div className="flex items-center gap-1 bg-[#F4F5FF] dark:bg-[#0D1120] p-1.5 rounded-lg border border-[#D9DDF0] dark:border-[#252B40]">
            <div className="flex items-center gap-1 px-1 text-xs font-bold text-[#475069] dark:text-[#A8B0C2]">
              <Zap className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#818CF8]" />
              <span>Speed:</span>
            </div>

            {[0.5, 1.0, 1.5, 2.0, 3.0].map((spd) => (
              <button
                key={spd}
                onClick={() => setAudioSpeed(spd)}
                className={`px-2 py-1 rounded-md text-xs font-extrabold transition-all ${
                  audioSpeed === spd
                    ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white shadow-xs'
                    : 'text-[#475069] dark:text-[#A8B0C2] hover:text-[#151827] dark:hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Font Style Segmented Control */}
          <div className="flex items-center gap-1 bg-[#F4F5FF] dark:bg-[#0D1120] p-1.5 rounded-lg border border-[#D9DDF0] dark:border-[#252B40]">
            <Type className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#6366F1] ml-1" />
            {(['kyokasho', 'mincho', 'gothic'] as FontStyle[]).map((font) => (
              <button
                key={font}
                onClick={() => onChangeFont(font)}
                className={`px-2.5 py-1 rounded-md text-xs font-extrabold transition-all ${
                  activeFont === font
                    ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white shadow-xs'
                    : 'text-[#475069] dark:text-[#A8B0C2] hover:text-[#151827] dark:hover:text-white'
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
          { id: 'all', label: 'All Sets' },
          { id: 'basic', label: 'Basic (Gojūon)' },
          { id: 'dakuon', label: 'Dakuon (゛)' },
          { id: 'handakuten', label: 'Handakuten (゜)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as FilterCategory)}
            className={`px-4 py-2 rounded-lg text-xs font-black shrink-0 transition-all border ${
              activeCategory === cat.id
                ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white border-[#4F46E5] dark:border-[#6366F1] shadow-xs'
                : 'bg-white dark:bg-[#111522] border-[#D9DDF0] dark:border-[#252B40] text-[#475069] dark:text-[#A8B0C2] hover:border-[#B8BDE0] dark:hover:border-[#343B58]'
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
              className={`rounded-xl bg-white dark:bg-[#111522] border p-4 sm:p-5 transition-all ${
                isRowPlaying
                  ? 'border-[#4F46E5] dark:border-[#6366F1] ring-2 ring-[#4F46E5]/20 shadow-xs'
                  : 'border-[#D9DDF0] dark:border-[#252B40]'
              }`}
            >
              
              {/* Row Header & Animated Equalizer Button */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#D9DDF0] dark:border-[#252B40]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-widest text-[#69738A] dark:text-[#737D94]">
                    ROW {row.name}
                  </span>
                  <span className="text-sm font-bold text-[#151827] dark:text-[#F8FAFC]" style={{ fontFamily: fontFamilies[activeFont] }}>
                    {row.label}
                  </span>
                </div>

                {/* Play Row Button with Indigo Waveform Animation */}
                <button
                  onClick={() => handlePlayFullRow(row.id, row.characters)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition-all ${
                    isRowPlaying
                      ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white shadow-xs'
                      : 'bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] hover:bg-[#E8EAFF] dark:hover:bg-[rgba(99,102,241,0.20)] text-[#4F46E5] dark:text-[#818CF8] border border-[#4F46E5]/30'
                  }`}
                  title={`Play all characters in Row ${row.name}`}
                >
                  {isRowPlaying ? (
                    <div className="flex items-end gap-0.5 h-3">
                      <div className="w-1 bg-white rounded-full animate-equalizer-1" />
                      <div className="w-1 bg-white rounded-full animate-equalizer-2" />
                      <div className="w-1 bg-white rounded-full animate-equalizer-3" />
                    </div>
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#818CF8]" />
                  )}
                  <span>{isRowPlaying ? `Playing Row ${row.name}...` : `Play Row`}</span>
                </button>
              </div>

              {/* Grid of Compact Character Tiles (36px Japanese font) */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {row.characters.map((char) => {
                  const isCharActive = activeChar === char.character;

                  return (
                    <button
                      key={char.id}
                      onClick={() => handleCharacterClick(char)}
                      className={`h-[76px] rounded-lg border flex flex-col items-center justify-center transition-all duration-200 group outline-none ${
                        isCharActive
                          ? 'bg-[#EEF2FF] dark:bg-[#171C2D] border-[#4F46E5] dark:border-[#6366F1] text-[#4F46E5] dark:text-[#818CF8] shadow-xs ring-2 ring-[#4F46E5]/30 scale-[1.03]'
                          : 'bg-[#F4F5FF] dark:bg-[#0D1120] border-[#D9DDF0] dark:border-[#252B40] text-[#151827] dark:text-[#F8FAFC] hover:border-[#4F46E5] dark:hover:border-[#6366F1] hover:bg-white dark:hover:bg-[#111522] hover:-translate-y-0.5 shadow-xs'
                      }`}
                      style={{ fontFamily: fontFamilies[activeFont] }}
                    >
                      <span className="text-36px text-[36px] font-bold group-hover:scale-105 transition-transform leading-none">{char.character}</span>
                      <span className={`text-[11px] font-bold mt-1 ${isCharActive ? 'text-[#4F46E5] dark:text-[#818CF8]' : 'text-[#475069] dark:text-[#A8B0C2] group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8]'}`}>
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
