import React, { useState, useEffect, useMemo } from 'react';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { HiraganaCharacter, FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { Check, RotateCcw, Sparkles, Trophy, Volume2, ArrowRightLeft } from 'lucide-react';
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

    // Pick 5 distinct characters (or up to 6)
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

    // Independently shuffle sound tiles so rows never align
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

  // Execute Match Checking Logic
  const checkMatch = (hTile: TileItem, sTile: TileItem) => {
    setMoves(m => m + 1);

    if (hTile.charId === sTile.charId) {
      // CORRECT MATCH
      onPlayAudio(hTile.characterObj.character);
      setJustMatchedPair({ hId: hTile.id, sId: sTile.id });
      setSelectedHiragana(null);
      setSelectedSound(null);

      // Brief success animation, then remove tiles and update progress
      setTimeout(() => {
        setMatchedCharIds(prev => {
          const updated = [...prev, hTile.charId];
          if (updated.length === totalCount) {
            setIsGameOver(true);
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          }
          return updated;
        });
        setJustMatchedPair(null);
      }, 350);

    } else {
      // INCORRECT MATCH
      setWrongPair({ hId: hTile.id, sId: sTile.id });
      setTimeout(() => {
        setSelectedHiragana(null);
        setSelectedSound(null);
        setWrongPair(null);
      }, 400);
    }
  };

  // Click / Tap Handler
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

  // Remaining active tiles after match reflow
  const remainingHiragana = useMemo(() => {
    return hiraganaTiles.filter(t => !matchedCharIds.includes(t.charId));
  }, [hiraganaTiles, matchedCharIds]);

  const remainingSounds = useMemo(() => {
    return soundTiles.filter(t => !matchedCharIds.includes(t.charId));
  }, [soundTiles, matchedCharIds]);

  // Completed pair list
  const completedPairs = useMemo(() => {
    return matchedCharIds.map(charId => {
      const tile = hiraganaTiles.find(t => t.charId === charId);
      return tile ? tile.characterObj : null;
    }).filter(Boolean) as HiraganaCharacter[];
  }, [matchedCharIds, hiraganaTiles]);

  // Format seconds to 00s
  const formattedTime = seconds < 10 ? `0${seconds}s` : `${seconds}s`;

  // VICTORY SCREEN
  if (isGameOver) {
    return (
      <div className="max-w-xl mx-auto space-y-6 py-6 animate-fadeIn">
        <div className="bg-[#151c2c] text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl text-center space-y-6">
          <Trophy className="w-14 h-14 mx-auto text-amber-400 animate-bounce" />
          <div>
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-widest border border-emerald-500/30">
              Great Job! 🎉
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-3">
              You matched all {totalCount} Hiragana.
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Time: <span className="text-white font-mono font-bold">{formattedTime}</span> &nbsp;|&nbsp; Moves: <span className="text-white font-bold">{moves}</span>
            </p>
          </div>

          {/* Completed Pairs Grid */}
          <div className="bg-[#0b0f19] p-4 rounded-2xl border border-slate-800 space-y-2 text-left">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Matched Pairs</span>
              <span className="text-[10px] text-slate-500">Tap to hear audio</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {completedPairs.map(charObj => (
                <button
                  key={charObj.id}
                  onClick={() => onPlayAudio(charObj.character)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-2 text-xs font-extrabold hover:scale-105"
                >
                  <span className={`text-base font-black ${FONT_CLASSES[activeFont]}`}>{charObj.character}</span>
                  <ArrowRightLeft className="w-3 h-3 text-rose-400" />
                  <span className="font-mono text-xs">"{charObj.romanization}"</span>
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={initGame}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
            {onFinish && (
              <button
                onClick={onFinish}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs border border-slate-700 transition-all hover:scale-105 active:scale-95"
              >
                Setup New Game
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 animate-fadeIn select-none">
      
      {/* Top Header Card */}
      <div className="bg-[#151c2c] p-5 rounded-3xl border border-slate-800/80 shadow-md space-y-4">
        
        {/* Title & Stats Row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Match the Hiragana</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Match each character with its correct sound.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-2 bg-[#0b0f19] px-3 py-1.5 rounded-xl border border-slate-800">
              <span>Time <span className="font-mono text-rose-400 font-extrabold">{formattedTime}</span></span>
              <span className="text-slate-700">•</span>
              <span>Moves <span className="text-rose-400 font-extrabold">{moves}</span></span>
            </div>

            <button
              onClick={initGame}
              className="p-2 rounded-xl bg-[#0b0f19] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="Reset Round"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Short Instruction & Progress Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            <span className="font-extrabold text-slate-200">Select a character, then select its sound.</span>
            <span className="hidden sm:inline text-slate-500 font-normal"> (Or drag onto its match)</span>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono font-extrabold text-rose-400 text-xs">
              {matchedCharIds.length} / {totalCount} matched
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalCount }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx < matchedCharIds.length
                      ? 'bg-rose-500 scale-110 shadow-xs shadow-rose-500/50'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Main Aligned 2-Column Game Board */}
      <div className="bg-[#151c2c] p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-xl space-y-4">
        
        {/* Column Labels */}
        <div className="grid grid-cols-2 gap-6 pb-2 border-b border-slate-800/60 text-xs font-black uppercase tracking-widest">
          <div className="text-rose-400 text-center sm:text-left sm:pl-2">
            HIRAGANA
          </div>
          <div className="text-indigo-400 text-center sm:text-left sm:pl-2">
            SOUND
          </div>
        </div>

        {/* Interactive Aligned Rows */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 min-h-[300px] items-start">
          
          {/* Left Column: Hiragana Tiles */}
          <div className="space-y-3">
            {remainingHiragana.map(tile => {
              const isSelected = selectedHiragana?.id === tile.id;
              const isWrong = wrongPair?.hId === tile.id;
              const isJustMatched = justMatchedPair?.hId === tile.id;
              const isDragging = draggedTile?.id === tile.id;
              const isTargetDrop = dragOverTileId === tile.id;

              let style = "bg-[#0b0f19] border-slate-800 text-white hover:border-rose-500/60 hover:scale-[1.02] shadow-xs cursor-pointer";

              if (isJustMatched) {
                style = "bg-emerald-500/20 border-emerald-500 text-emerald-400 scale-105 ring-2 ring-emerald-500/40 animate-pulse";
              } else if (isWrong) {
                style = "bg-rose-500/20 border-rose-500 text-rose-300 scale-105 ring-2 ring-rose-500/40 animate-shake";
              } else if (isSelected) {
                style = "bg-rose-500/15 border-rose-500 text-white ring-2 ring-rose-500/40 scale-[1.03] shadow-md shadow-rose-500/10";
              } else if (isTargetDrop) {
                style = "bg-rose-500/20 border-rose-400 text-rose-300 ring-2 ring-rose-400/40 scale-105 shadow-md";
              } else if (isDragging) {
                style = "opacity-40 border-dashed border-rose-500 bg-rose-500/10 scale-95";
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
                  className={`w-full h-[72px] sm:h-[80px] max-w-[180px] mx-auto rounded-2xl border-2 flex items-center justify-center transition-all duration-200 outline-none focus:ring-2 focus:ring-rose-500 ${style}`}
                >
                  <span className={`text-3xl sm:text-4xl font-bold tracking-normal ${FONT_CLASSES[activeFont]}`}>
                    {tile.display}
                  </span>

                  {isJustMatched && (
                    <Check className="w-4 h-4 text-emerald-400 ml-2 animate-scaleIn" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Sound Tiles (Independently Shuffled) */}
          <div className="space-y-3">
            {remainingSounds.map(tile => {
              const isSelected = selectedSound?.id === tile.id;
              const isWrong = wrongPair?.sId === tile.id;
              const isJustMatched = justMatchedPair?.sId === tile.id;
              const isDragging = draggedTile?.id === tile.id;
              const isTargetDrop = dragOverTileId === tile.id;

              let style = "bg-[#0b0f19] border-slate-800 text-white hover:border-indigo-500/60 hover:scale-[1.02] shadow-xs cursor-pointer";

              if (isJustMatched) {
                style = "bg-emerald-500/20 border-emerald-500 text-emerald-400 scale-105 ring-2 ring-emerald-500/40 animate-pulse";
              } else if (isWrong) {
                style = "bg-rose-500/20 border-rose-500 text-rose-300 scale-105 ring-2 ring-rose-500/40 animate-shake";
              } else if (isSelected) {
                style = "bg-indigo-500/15 border-indigo-500 text-white ring-2 ring-indigo-500/40 scale-[1.03] shadow-md shadow-indigo-500/10";
              } else if (isTargetDrop) {
                style = "bg-indigo-500/20 border-indigo-400 text-indigo-300 ring-2 ring-indigo-400/40 scale-105 shadow-md";
              } else if (isDragging) {
                style = "opacity-40 border-dashed border-indigo-500 bg-indigo-500/10 scale-95";
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
                  className={`w-full h-[72px] sm:h-[80px] max-w-[180px] mx-auto rounded-2xl border-2 flex items-center justify-center transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500 ${style}`}
                >
                  <span className="text-xl sm:text-2xl font-bold font-mono tracking-wider">
                    "{tile.display}"
                  </span>

                  {isJustMatched && (
                    <Check className="w-4 h-4 text-emerald-400 ml-2 animate-scaleIn" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Completed Pairs Section at Bottom */}
      {completedPairs.length > 0 && (
        <div className="bg-[#151c2c] p-4 sm:p-5 rounded-3xl border border-slate-800/80 shadow-md space-y-2 animate-fadeIn">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center justify-between">
            <span>Completed Matches ({completedPairs.length}/{totalCount})</span>
            <span className="text-[10px] text-slate-500 font-normal">Tap to re-hear Japanese audio</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {completedPairs.map(charObj => (
              <button
                key={charObj.id}
                onClick={() => onPlayAudio(charObj.character)}
                className="px-3 py-1.5 rounded-xl bg-[#0b0f19] hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all flex items-center gap-2 text-xs font-extrabold hover:scale-105"
              >
                <span className={`text-base font-black ${FONT_CLASSES[activeFont]}`}>{charObj.character}</span>
                <ArrowRightLeft className="w-3 h-3 text-rose-400" />
                <span className="font-mono text-xs">"{charObj.romanization}"</span>
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
