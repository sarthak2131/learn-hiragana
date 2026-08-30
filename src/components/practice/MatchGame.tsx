import React, { useState, useEffect, useMemo } from 'react';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { HiraganaCharacter, FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { Check, RotateCcw, Trophy, Volume2, ArrowRightLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchGameProps {
  activeFont: FontStyle;
  selectedRowIds: string[];
  onPlayAudio: (text: string) => void;
  onFinish?: () => void;
}

interface TileItem {
  id: string;
  charId: string;
  display: string;
  type: 'hiragana' | 'sound';
  characterObj: HiraganaCharacter;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const MatchGame: React.FC<MatchGameProps> = ({
  activeFont,
  selectedRowIds,
  onPlayAudio,
  onFinish
}) => {
  const [hiraganaTiles, setHiraganaTiles] = useState<TileItem[]>([]);
  const [soundTiles, setSoundTiles] = useState<TileItem[]>([]);
  const [selectedHiragana, setSelectedHiragana] = useState<TileItem | null>(null);
  const [selectedSound, setSelectedSound] = useState<TileItem | null>(null);
  const [matchedCharIds, setMatchedCharIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<{ hId: string; sId: string } | null>(null);
  const [justMatchedPair, setJustMatchedPair] = useState<{ hId: string; sId: string } | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(5);

  // Drag & Drop State
  const [draggedTile, setDraggedTile] = useState<TileItem | null>(null);
  const [dragOverTileId, setDragOverTileId] = useState<string | null>(null);

  // Initialize Game Board
  const initGame = () => {
    let pool = HIRAGANA_DATA.filter(c => selectedRowIds.includes(c.row));
    if (pool.length === 0) pool = HIRAGANA_DATA;

    const countToPick = Math.min(pool.length, 5);
    const chosen = shuffle(pool).slice(0, countToPick);
    setTotalCount(chosen.length);

    const hTiles: TileItem[] = chosen.map(c => ({
      id: `h_${c.id}`,
      charId: c.id,
      display: c.character,
      type: 'hiragana',
      characterObj: c
    }));

    const sTiles: TileItem[] = chosen.map(c => ({
      id: `s_${c.id}`,
      charId: c.id,
      display: c.romanization,
      type: 'sound',
      characterObj: c
    }));

    let shuffledH = shuffle(hTiles);
    let shuffledS = shuffle(sTiles);

    // Prevent identical index matching by row position
    for (let i = 0; i < shuffledH.length; i++) {
      if (shuffledH[i].charId === shuffledS[i].charId && shuffledS.length > 1) {
        const swapIdx = (i + 1) % shuffledS.length;
        [shuffledS[i], shuffledS[swapIdx]] = [shuffledS[swapIdx], shuffledS[i]];
      }
    }

    setHiraganaTiles(shuffledH);
    setSoundTiles(shuffledS);
    setSelectedHiragana(null);
    setSelectedSound(null);
    setMatchedCharIds([]);
    setWrongPair(null);
    setJustMatchedPair(null);
    setMoves(0);
    setSeconds(0);
    setIsGameOver(false);
    setDraggedTile(null);
    setDragOverTileId(null);
  };

  useEffect(() => {
    initGame();
  }, [selectedRowIds]);

  // Timer interval
  useEffect(() => {
    if (isGameOver || totalCount === 0) return;
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isGameOver, totalCount]);

  const checkMatch = (hTile: TileItem, sTile: TileItem) => {
    setMoves(m => m + 1);

    if (hTile.charId === sTile.charId) {
      // CORRECT MATCH (Indigo Monochromatic Success)
      setJustMatchedPair({ hId: hTile.id, sId: sTile.id });
      setSelectedHiragana(null);
      setSelectedSound(null);

      setTimeout(() => {
        setMatchedCharIds(prev => {
          const updated = [...prev, hTile.charId];
          if (updated.length === totalCount) {
            setIsGameOver(true);
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#6366F1', '#818CF8', '#4F46E5'] });
          }
          return updated;
        });
        setJustMatchedPair(null);
      }, 350);

    } else {
      // INCORRECT MATCH (Restrained Red Shake)
      setWrongPair({ hId: hTile.id, sId: sTile.id });
      setTimeout(() => {
        setSelectedHiragana(null);
        setSelectedSound(null);
        setWrongPair(null);
      }, 400);
    }
  };

  const handleTileClick = (tile: TileItem) => {
    if (matchedCharIds.includes(tile.charId) || wrongPair || justMatchedPair) return;

    onPlayAudio(tile.characterObj.character);

    if (tile.type === 'hiragana') {
      if (selectedHiragana?.id === tile.id) {
        setSelectedHiragana(null);
        return;
      }
      setSelectedHiragana(tile);
      if (selectedSound) {
        checkMatch(tile, selectedSound);
      }
    } else {
      if (selectedSound?.id === tile.id) {
        setSelectedSound(null);
        return;
      }
      setSelectedSound(tile);
      if (selectedHiragana) {
        checkMatch(selectedHiragana, tile);
      }
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, tile: TileItem) => {
    if (matchedCharIds.includes(tile.charId)) {
      e.preventDefault();
      return;
    }
    setDraggedTile(tile);
    e.dataTransfer.setData('text/plain', tile.id);
    e.dataTransfer.effectAllowed = 'move';
    onPlayAudio(tile.characterObj.character);
  };

  const handleDragOver = (e: React.DragEvent, targetTile: TileItem) => {
    if (!draggedTile || matchedCharIds.includes(targetTile.charId)) return;
    if (draggedTile.type !== targetTile.type) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragOverTileId !== targetTile.id) {
        setDragOverTileId(targetTile.id);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent, targetTile: TileItem) => {
    if (dragOverTileId === targetTile.id) {
      setDragOverTileId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetTile: TileItem) => {
    e.preventDefault();
    setDragOverTileId(null);
    if (!draggedTile || matchedCharIds.includes(targetTile.charId)) return;
    if (draggedTile.type === targetTile.type) return;

    if (draggedTile.type === 'hiragana') {
      checkMatch(draggedTile, targetTile);
    } else {
      checkMatch(targetTile, draggedTile);
    }
    setDraggedTile(null);
  };

  const remainingHiragana = useMemo(() => {
    return hiraganaTiles.filter(t => !matchedCharIds.includes(t.charId));
  }, [hiraganaTiles, matchedCharIds]);

  const remainingSounds = useMemo(() => {
    return soundTiles.filter(t => !matchedCharIds.includes(t.charId));
  }, [soundTiles, matchedCharIds]);

  const completedPairs = useMemo(() => {
    return matchedCharIds.map(charId => {
      const tile = hiraganaTiles.find(t => t.charId === charId);
      return tile ? tile.characterObj : null;
    }).filter(Boolean) as HiraganaCharacter[];
  }, [matchedCharIds, hiraganaTiles]);

  const formattedTime = seconds < 10 ? `0${seconds}s` : `${seconds}s`;

  // VICTORY SCREEN (Monochromatic Indigo Celebration)
  if (isGameOver) {
    return (
      <div className="max-w-xl mx-auto space-y-6 py-6 animate-pageTransition">
        <div className="bg-white dark:bg-[#111522] text-[#151827] dark:text-[#F8FAFC] p-8 sm:p-10 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xl text-center space-y-6 transition-colors duration-200">
          <Trophy className="w-14 h-14 mx-auto text-[#4F46E5] dark:text-[#6366F1] animate-bounce" />
          <div>
            <span className="px-3.5 py-1 rounded-full bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] text-[#4F46E5] dark:text-[#818CF8] text-xs font-extrabold uppercase tracking-widest border border-[#4F46E5]/20 dark:border-[#6366F1]/30">
              ✓ Perfect Match!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-3">
              You matched all {totalCount} Hiragana.
            </h2>
            <p className="text-xs text-[#475069] dark:text-[#A8B0C2] mt-2">
              Time: <span className="text-[#151827] dark:text-white font-mono font-bold">{formattedTime}</span> &nbsp;|&nbsp; Moves: <span className="text-[#151827] dark:text-white font-bold">{moves}</span>
            </p>
          </div>

          {/* Completed Pairs Grid */}
          <div className="bg-[#F4F5FF] dark:bg-[#0D1120] p-4 rounded-xl border border-[#D9DDF0] dark:border-[#252B40] space-y-2 text-left">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#475069] dark:text-[#A8B0C2] flex items-center justify-between">
              <span>Matched Pairs</span>
              <span className="text-[10px] text-[#69738A] dark:text-[#737D94]">Tap to hear audio</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {completedPairs.map(charObj => (
                <button
                  key={charObj.id}
                  onClick={() => onPlayAudio(charObj.character)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#171C2D] hover:bg-slate-100 dark:hover:bg-[#171C2D]/80 text-[#151827] dark:text-white border border-[#D9DDF0] dark:border-[#343B58] transition-all flex items-center gap-2 text-xs font-extrabold hover:scale-105 shadow-xs"
                >
                  <span className={`text-base font-black ${FONT_CLASSES[activeFont]}`}>{charObj.character}</span>
                  <ArrowRightLeft className="w-3 h-3 text-[#4F46E5] dark:text-[#6366F1]" />
                  <span className="font-mono text-xs">"{charObj.romanization}"</span>
                  <Volume2 className="w-3.5 h-3.5 text-[#69738A] dark:text-[#737D94]" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={initGame}
              className="w-full sm:w-auto px-7 py-3 rounded-lg bg-[#4F46E5] dark:bg-[#6366F1] hover:bg-[#4338CA] dark:hover:bg-[#818CF8] text-white font-black text-xs shadow-md shadow-[#4F46E5]/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
            {onFinish && (
              <button
                onClick={onFinish}
                className="w-full sm:w-auto px-7 py-3 rounded-lg bg-[#F4F5FF] dark:bg-[#171C2D] hover:bg-slate-200 dark:hover:bg-[#171C2D]/80 text-[#151827] dark:text-[#F8FAFC] font-bold text-xs border border-[#D9DDF0] dark:border-[#343B58] transition-all hover:scale-105 active:scale-95"
              >
                Back to Practice
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 animate-pageTransition select-none">
      
      {/* Top Header HUD Panel */}
      <div className="bg-white dark:bg-[#111522] p-5 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xs space-y-4 transition-colors duration-200">
        
        {/* Title & HUD Stats Row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#151827] dark:text-[#F8FAFC] tracking-tight">
              MATCH THE HIRAGANA
            </h2>
            <p className="text-xs text-[#475069] dark:text-[#A8B0C2] mt-0.5">
              Select a character and match it with its sound. You can also drag a character onto its sound.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-xs font-bold text-[#475069] dark:text-[#A8B0C2] flex items-center gap-2 bg-[#F4F5FF] dark:bg-[#0D1120] px-3 py-1.5 rounded-lg border border-[#D9DDF0] dark:border-[#252B40]">
              <span>TIME <span className="font-mono text-[#4F46E5] dark:text-[#6366F1] font-black">{formattedTime}</span></span>
              <span className="text-[#D9DDF0] dark:text-[#343B58]">•</span>
              <span>MOVES <span className="text-[#4F46E5] dark:text-[#6366F1] font-black">{moves}</span></span>
            </div>

            <button
              onClick={initGame}
              className="p-2 rounded-lg bg-[#F4F5FF] dark:bg-[#0D1120] hover:bg-slate-200 dark:hover:bg-[#171C2D] text-[#475069] dark:text-[#A8B0C2] hover:text-[#151827] dark:hover:text-white border border-[#D9DDF0] dark:border-[#252B40] transition-colors"
              title="Reset Round"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Instruction & Progress Indicator */}
        <div className="pt-3 border-t border-[#D9DDF0] dark:border-[#252B40] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-[#475069] dark:text-[#A8B0C2]">
            <span className="font-bold text-[#151827] dark:text-[#F8FAFC]">Select a character, then select its sound.</span>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono font-black text-[#4F46E5] dark:text-[#6366F1] text-xs">
              {matchedCharIds.length} / {totalCount} matched
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalCount }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx < matchedCharIds.length
                      ? 'bg-[#4F46E5] dark:bg-[#6366F1] scale-110 shadow-xs'
                      : 'bg-[#F4F5FF] dark:bg-[#0D1120] border border-[#D9DDF0] dark:border-[#252B40]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Central Monochromatic Indigo Game Board */}
      <div className="bg-white dark:bg-[#111522] p-6 sm:p-8 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-md space-y-4 transition-colors duration-200">
        
        {/* Column Headers */}
        <div className="grid grid-cols-2 gap-6 pb-2 border-b border-[#D9DDF0] dark:border-[#252B40] text-xs font-black uppercase tracking-widest">
          <div className="text-[#4F46E5] dark:text-[#6366F1] text-center sm:text-left sm:pl-2">
            HIRAGANA
          </div>
          <div className="text-[#4F46E5] dark:text-[#818CF8] text-center sm:text-left sm:pl-2">
            SOUND
          </div>
        </div>

        {/* Interactive Rows */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 min-h-[280px] items-start relative">
          
          {/* Left Column: Hiragana Tiles */}
          <div className="space-y-3">
            {remainingHiragana.map(tile => {
              const isSelected = selectedHiragana?.id === tile.id;
              const isWrong = wrongPair?.hId === tile.id;
              const isJustMatched = justMatchedPair?.hId === tile.id;
              const isDragging = draggedTile?.id === tile.id;
              const isTargetDrop = dragOverTileId === tile.id;

              let style = "bg-[#F4F5FF] dark:bg-[#0D1120] border-[#D9DDF0] dark:border-[#252B40] text-[#151827] dark:text-[#F8FAFC] hover:border-[#B8BDE0] dark:hover:border-[#343B58] hover:bg-white dark:hover:bg-[#111522] hover:scale-[1.02] shadow-xs cursor-pointer";

              if (isJustMatched) {
                style = "bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.20)] border-2 border-[#4F46E5] dark:border-[#6366F1] text-[#4F46E5] dark:text-[#818CF8] scale-105 ring-2 ring-[#4F46E5]/40 animate-pulse";
              } else if (isWrong) {
                style = "bg-[#B42318]/10 border-2 border-[#B42318] dark:border-[#EF4444] text-[#B42318] dark:text-[#EF4444] scale-105 ring-2 ring-[#B42318]/40 animate-shake";
              } else if (isSelected) {
                style = "bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.14)] border-2 border-[#4F46E5] dark:border-[#6366F1] text-[#151827] dark:text-[#F8FAFC] ring-2 ring-[#4F46E5]/40 scale-[1.03]";
              } else if (isTargetDrop) {
                style = "bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.20)] border-2 border-[#4F46E5] dark:border-[#6366F1] text-[#4F46E5] dark:text-[#818CF8] ring-2 ring-[#4F46E5]/40 scale-105 shadow-md";
              } else if (isDragging) {
                style = "opacity-40 border-dashed border-[#4F46E5] dark:border-[#6366F1] bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] scale-95";
              }

              return (
                <button
                  key={tile.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tile)}
                  onDragOver={(e) => handleDragOver(e, tile)}
                  onDragLeave={(e) => handleDragLeave(e, tile)}
                  onDrop={(e) => handleDrop(e, tile)}
                  onClick={() => handleTileClick(tile)}
                  aria-label={`Hiragana character ${tile.display}`}
                  className={`w-full h-[72px] sm:h-[80px] max-w-[180px] mx-auto rounded-lg flex items-center justify-center transition-all duration-200 outline-none focus:ring-2 focus:ring-[#4F46E5] ${style}`}
                >
                  <span className={`text-3xl sm:text-4xl font-bold tracking-normal ${FONT_CLASSES[activeFont]}`}>
                    {tile.display}
                  </span>

                  {isJustMatched && (
                    <Check className="w-4 h-4 text-[#4F46E5] dark:text-[#6366F1] ml-2 animate-scaleIn stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Sound Tiles */}
          <div className="space-y-3">
            {remainingSounds.map(tile => {
              const isSelected = selectedSound?.id === tile.id;
              const isWrong = wrongPair?.sId === tile.id;
              const isJustMatched = justMatchedPair?.sId === tile.id;
              const isDragging = draggedTile?.id === tile.id;
              const isTargetDrop = dragOverTileId === tile.id;

              let style = "bg-[#F4F5FF] dark:bg-[#0D1120] border-[#D9DDF0] dark:border-[#252B40] text-[#151827] dark:text-[#F8FAFC] hover:border-[#B8BDE0] dark:hover:border-[#343B58] hover:bg-white dark:hover:bg-[#111522] hover:scale-[1.02] shadow-xs cursor-pointer";

              if (isJustMatched) {
                style = "bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.20)] border-2 border-[#4F46E5] dark:border-[#6366F1] text-[#4F46E5] dark:text-[#818CF8] scale-105 ring-2 ring-[#4F46E5]/40 animate-pulse";
              } else if (isWrong) {
                style = "bg-[#B42318]/10 border-2 border-[#B42318] dark:border-[#EF4444] text-[#B42318] dark:text-[#EF4444] scale-105 ring-2 ring-[#B42318]/40 animate-shake";
              } else if (isSelected) {
                style = "bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.14)] border-2 border-[#4F46E5] dark:border-[#6366F1] text-[#151827] dark:text-[#F8FAFC] ring-2 ring-[#4F46E5]/40 scale-[1.03]";
              } else if (isTargetDrop) {
                style = "bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.20)] border-2 border-[#4F46E5] dark:border-[#6366F1] text-[#4F46E5] dark:text-[#818CF8] ring-2 ring-[#4F46E5]/40 scale-105 shadow-md";
              } else if (isDragging) {
                style = "opacity-40 border-dashed border-[#4F46E5] dark:border-[#6366F1] bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] scale-95";
              }

              return (
                <button
                  key={tile.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tile)}
                  onDragOver={(e) => handleDragOver(e, tile)}
                  onDragLeave={(e) => handleDragLeave(e, tile)}
                  onDrop={(e) => handleDrop(e, tile)}
                  onClick={() => handleTileClick(tile)}
                  aria-label={`Sound pronunciation ${tile.display}`}
                  className={`w-full h-[72px] sm:h-[80px] max-w-[180px] mx-auto rounded-lg flex items-center justify-center transition-all duration-200 outline-none focus:ring-2 focus:ring-[#4F46E5] ${style}`}
                >
                  <span className="text-xl sm:text-2xl font-bold font-mono tracking-wider">
                    "{tile.display}"
                  </span>

                  {isJustMatched && (
                    <Check className="w-4 h-4 text-[#4F46E5] dark:text-[#6366F1] ml-2 animate-scaleIn stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Completed Matches Gallery */}
      {completedPairs.length > 0 && (
        <div className="bg-white dark:bg-[#111522] p-4 sm:p-5 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xs space-y-2 animate-pageTransition transition-colors duration-200">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-between">
            <span>Completed Matches ({completedPairs.length}/{totalCount})</span>
            <span className="text-[10px] text-[#69738A] dark:text-[#737D94] font-normal">Tap to re-hear Japanese audio</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {completedPairs.map(charObj => (
              <button
                key={charObj.id}
                onClick={() => onPlayAudio(charObj.character)}
                className="px-3 py-1.5 rounded-lg bg-[#F4F5FF] dark:bg-[#0D1120] hover:bg-slate-200 dark:hover:bg-[#171C2D] text-[#151827] dark:text-[#A8B0C2] border border-[#D9DDF0] dark:border-[#252B40] transition-all flex items-center gap-2 text-xs font-extrabold hover:scale-105 shadow-xs"
              >
                <span className={`text-base font-black ${FONT_CLASSES[activeFont]}`}>{charObj.character}</span>
                <ArrowRightLeft className="w-3 h-3 text-[#4F46E5] dark:text-[#6366F1]" />
                <span className="font-mono text-xs">"{charObj.romanization}"</span>
                <Volume2 className="w-3.5 h-3.5 text-[#69738A] dark:text-[#737D94]" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
