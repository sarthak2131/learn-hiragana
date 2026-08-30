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

  const [draggedTile, setDraggedTile] = useState<TileItem | null>(null);
  const [dragOverTileId, setDragOverTileId] = useState<string | null>(null);

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

  useEffect(() => {
    if (isGameOver || totalCount === 0) return;
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isGameOver, totalCount]);

  const checkMatch = (hTile: TileItem, sTile: TileItem) => {
    setMoves(m => m + 1);

    if (hTile.charId === sTile.charId) {
      setJustMatchedPair({ hId: hTile.id, sId: sTile.id });
      setSelectedHiragana(null);
      setSelectedSound(null);

      setTimeout(() => {
        setMatchedCharIds(prev => {
          const updated = [...prev, hTile.charId];
          if (updated.length === totalCount) {
            setIsGameOver(true);
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#8B9B7A', '#66765B', '#DCE4D4'] });
          }
          return updated;
        });
        setJustMatchedPair(null);
      }, 350);

    } else {
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

  if (isGameOver) {
    return (
      <div className="max-w-md mx-auto space-y-4 py-2 animate-pageTransition">
        <div className="bg-[#FFFDF8] text-[#30312F] p-6 sm:p-8 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] text-center space-y-4 transition-colors duration-200">
          <Trophy className="w-10 h-10 mx-auto text-[#D9AE58] animate-bounce" />
          <div>
            <span className="px-3 py-0.5 rounded-full bg-[#E5EBDD] text-[#66765B] text-[10px] font-extrabold uppercase tracking-widest border border-[#CCD6C2]">
              ✓ Perfect Match!
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2">
              You matched all {totalCount} Hiragana.
            </h2>
            <p className="text-xs text-[#6F716C] mt-1">
              Time: <span className="text-[#30312F] font-mono font-bold">{formattedTime}</span> &nbsp;|&nbsp; Moves: <span className="text-[#30312F] font-bold">{moves}</span>
            </p>
          </div>

          <div className="bg-[#F4F1E9] p-3 rounded-xl border border-[#DDD7CB] space-y-1.5 text-left">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6F716C] flex items-center justify-between">
              <span>Matched Pairs</span>
              <span className="text-[9px] text-[#96978F]">Tap to hear audio</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {completedPairs.map(charObj => (
                <button
                  key={charObj.id}
                  onClick={() => onPlayAudio(charObj.character)}
                  className="px-2.5 py-1 rounded-lg bg-[#FFFDF8] hover:bg-[#F0EEE6] text-[#30312F] border border-[#DDD7CB] transition-all flex items-center gap-1.5 text-xs font-bold hover:scale-105 shadow-xs"
                >
                  <span className={`text-sm font-black ${FONT_CLASSES[activeFont]}`}>{charObj.character}</span>
                  <ArrowRightLeft className="w-3 h-3 text-[#66765B]" />
                  <span className="font-mono text-xs">"{charObj.romanization}"</span>
                  <Volume2 className="w-3 h-3 text-[#6F716C]" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={initGame}
              className="px-6 py-2.5 rounded-xl bg-[#8B9B7A] hover:bg-[#66765B] text-[#FFFDF8] font-bold text-xs shadow-xs hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
            {onFinish && (
              <button
                onClick={onFinish}
                className="px-6 py-2.5 rounded-xl bg-[#FFFDF8] hover:bg-[#F0EEE6] text-[#30312F] font-bold text-xs border border-[#D8D3C8] transition-all hover:scale-105 active:scale-95"
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
    <div className="max-w-xl mx-auto space-y-3 py-0 animate-pageTransition select-none">
      
      {/* Top Header HUD Panel */}
      <div className="bg-[#FFFDF8] p-3.5 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex items-center justify-between gap-3 transition-colors duration-200">
        <div>
          <h2 className="text-base font-black text-[#30312F] tracking-tight">
            MATCH THE HIRAGANA
          </h2>
          <p className="text-[11px] text-[#6F716C]">
            Select or drag a character onto its matching sound.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-xs font-bold text-[#6F716C] flex items-center gap-1.5 bg-[#F4F1E9] px-2.5 py-1 rounded-lg border border-[#DDD7CB]">
            <span>TIME <span className="font-mono text-[#66765B] font-black">{formattedTime}</span></span>
            <span className="text-[#DDD7CB]">•</span>
            <span>MOVES <span className="text-[#66765B] font-black">{moves}</span></span>
          </div>

          <button
            onClick={initGame}
            className="p-1.5 rounded-lg bg-[#F4F1E9] hover:bg-[#F0EEE6] text-[#6F716C] hover:text-[#30312F] border border-[#DDD7CB] transition-colors"
            title="Reset Round"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Central Board */}
      <div className="bg-[#FFFDF8] p-4 sm:p-5 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] space-y-2.5 transition-colors duration-200">
        <div className="grid grid-cols-2 gap-4 pb-1.5 border-b border-[#E6E0D4] text-[11px] font-black uppercase tracking-widest">
          <div className="text-[#66765B] text-center sm:text-left sm:pl-2">
            HIRAGANA
          </div>
          <div className="text-[#66765B] text-center sm:text-left sm:pl-2">
            SOUND
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 items-start relative">
          
          {/* Left Column: Hiragana Tiles */}
          <div className="space-y-2">
            {remainingHiragana.map(tile => {
              const isSelected = selectedHiragana?.id === tile.id;
              const isWrong = wrongPair?.hId === tile.id;
              const isJustMatched = justMatchedPair?.hId === tile.id;
              const isDragging = draggedTile?.id === tile.id;
              const isTargetDrop = dragOverTileId === tile.id;

              let style = "bg-[#FFFDF8] border-[#E6E0D4] text-[#30312F] hover:border-[#B7C4AA] hover:bg-[#FEFCF7] hover:scale-[1.02] shadow-xs cursor-pointer";

              if (isJustMatched) {
                style = "bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#66765B] scale-105 ring-2 ring-[#8B9B7A]/30 animate-pulse";
              } else if (isWrong) {
                style = "bg-[#F8E5E0] border-2 border-[#D96F61] text-[#D96F61] scale-105 ring-2 ring-[#D96F61]/30 animate-shake";
              } else if (isSelected) {
                style = "bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#30312F] ring-2 ring-[#8B9B7A]/30 scale-[1.02]";
              } else if (isTargetDrop) {
                style = "bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#66765B] ring-2 ring-[#8B9B7A]/30 scale-105 shadow-xs";
              } else if (isDragging) {
                style = "opacity-40 border-dashed border-[#8B9B7A] bg-[#F1F5ED] scale-95";
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
                  className={`w-full h-[48px] sm:h-[54px] max-w-[160px] mx-auto rounded-xl flex items-center justify-center transition-all duration-180 outline-none focus:ring-2 focus:ring-[#8B9B7A] ${style}`}
                >
                  <span className={`text-2xl sm:text-3xl font-bold tracking-normal ${FONT_CLASSES[activeFont]}`}>
                    {tile.display}
                  </span>

                  {isJustMatched && (
                    <Check className="w-3.5 h-3.5 text-[#66765B] ml-1.5 animate-scaleIn stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Sound Tiles */}
          <div className="space-y-2">
            {remainingSounds.map(tile => {
              const isSelected = selectedSound?.id === tile.id;
              const isWrong = wrongPair?.sId === tile.id;
              const isJustMatched = justMatchedPair?.sId === tile.id;
              const isDragging = draggedTile?.id === tile.id;
              const isTargetDrop = dragOverTileId === tile.id;

              let style = "bg-[#FFFDF8] border-[#E6E0D4] text-[#30312F] hover:border-[#B7C4AA] hover:bg-[#FEFCF7] hover:scale-[1.02] shadow-xs cursor-pointer";

              if (isJustMatched) {
                style = "bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#66765B] scale-105 ring-2 ring-[#8B9B7A]/30 animate-pulse";
              } else if (isWrong) {
                style = "bg-[#F8E5E0] border-2 border-[#D96F61] text-[#D96F61] scale-105 ring-2 ring-[#D96F61]/30 animate-shake";
              } else if (isSelected) {
                style = "bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#30312F] ring-2 ring-[#8B9B7A]/30 scale-[1.02]";
              } else if (isTargetDrop) {
                style = "bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#66765B] ring-2 ring-[#8B9B7A]/30 scale-105 shadow-xs";
              } else if (isDragging) {
                style = "opacity-40 border-dashed border-[#8B9B7A] bg-[#F1F5ED] scale-95";
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
                  className={`w-full h-[48px] sm:h-[54px] max-w-[160px] mx-auto rounded-xl flex items-center justify-center transition-all duration-180 outline-none focus:ring-2 focus:ring-[#8B9B7A] ${style}`}
                >
                  <span className="text-base sm:text-lg font-bold font-mono tracking-wider">
                    "{tile.display}"
                  </span>

                  {isJustMatched && (
                    <Check className="w-3.5 h-3.5 text-[#66765B] ml-1.5 animate-scaleIn stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Completed Matches Gallery */}
      {completedPairs.length > 0 && (
        <div className="bg-[#FFFDF8] p-3 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] space-y-1 animate-pageTransition transition-colors duration-200">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#66765B] flex items-center justify-between">
            <span>Completed ({completedPairs.length}/{totalCount})</span>
            <span className="text-[9px] text-[#6F716C] font-normal">Tap to re-hear audio</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {completedPairs.map(charObj => (
              <button
                key={charObj.id}
                onClick={() => onPlayAudio(charObj.character)}
                className="px-2.5 py-1 rounded-lg bg-[#F4F1E9] hover:bg-[#F0EEE6] text-[#30312F] border border-[#DDD7CB] transition-all flex items-center gap-1.5 text-xs font-bold hover:scale-105 shadow-xs"
              >
                <span className={`text-sm font-black ${FONT_CLASSES[activeFont]}`}>{charObj.character}</span>
                <ArrowRightLeft className="w-3 h-3 text-[#66765B]" />
                <span className="font-mono text-[11px]">"{charObj.romanization}"</span>
                <Volume2 className="w-3 h-3 text-[#6F716C]" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
