import React, { useState, useEffect, useMemo } from 'react';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { HiraganaCharacter, FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { CheckCircle2, RotateCcw, Sparkles, Trophy, Flame } from 'lucide-react';
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
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Initialize Game Board
  const initGame = () => {
    let pool = HIRAGANA_DATA.filter(c => selectedRowIds.includes(c.row));
    if (pool.length < 6) pool = HIRAGANA_DATA;

    // Select 6 distinct characters for clean matching grid
    const chosen = shuffle(pool).slice(0, 6);

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

    // Independently shuffle both lists so they never align
    let shuffledH = shuffle(hTiles);
    let shuffledS = shuffle(sTiles);

    // Prevent identical index matching
    for (let i = 0; i < shuffledH.length; i++) {
      if (shuffledH[i].charId === shuffledS[i].charId) {
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
    setMoves(0);
    setSeconds(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, [selectedRowIds]);

  // Timer interval
  useEffect(() => {
    if (isGameOver || hiraganaTiles.length === 0) return;
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isGameOver, hiraganaTiles]);

  const handleTileClick = (tile: TileItem) => {
    if (matchedCharIds.includes(tile.charId) || wrongPair) return;

    if (tile.type === 'hiragana') {
      onPlayAudio(tile.characterObj.character);
      setSelectedHiragana(tile);
      if (selectedSound) {
        checkMatch(tile, selectedSound);
      }
    } else {
      setSelectedSound(tile);
      if (selectedHiragana) {
        checkMatch(selectedHiragana, tile);
      }
    }
  };

  const checkMatch = (hTile: TileItem, sTile: TileItem) => {
    setMoves(m => m + 1);

    if (hTile.charId === sTile.charId) {
      // SUCCESS MATCH
      const newMatched = [...matchedCharIds, hTile.charId];
      setMatchedCharIds(newMatched);
      setSelectedHiragana(null);
      setSelectedSound(null);

      if (newMatched.length === hiraganaTiles.length) {
        setIsGameOver(true);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    } else {
      // WRONG MATCH
      setWrongPair({ hId: hTile.id, sId: sTile.id });
      setTimeout(() => {
        setSelectedHiragana(null);
        setSelectedSound(null);
        setWrongPair(null);
      }, 700);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2 animate-fadeIn">
      
      {/* Header Controls */}
      <div className="bg-white dark:bg-[#151c2c] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <span>Match Up — Pair Hiragana & Sounds</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click a Hiragana character on the left, then click its matching sound on the right
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Time: <span className="text-rose-600 dark:text-rose-400 font-mono">{seconds}s</span> | Moves: <span className="text-rose-600 dark:text-rose-400">{moves}</span>
          </div>

          <button
            onClick={initGame}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Shuffle and Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Matching Interactive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-[#151c2c] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        
        {/* Left Deck: Hiragana Characters */}
        <div className="space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 text-center pb-2 border-b border-slate-100 dark:border-slate-800">
            Hiragana Characters
          </div>
          <div className="grid grid-cols-2 gap-3">
            {hiraganaTiles.map(tile => {
              const isMatched = matchedCharIds.includes(tile.charId);
              const isSelected = selectedHiragana?.id === tile.id;
              const isWrong = wrongPair?.hId === tile.id;

              let style = "bg-slate-50 dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-rose-400 dark:hover:border-rose-600 hover:scale-[1.02]";

              if (isMatched) {
                style = "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 opacity-60 pointer-events-none";
              } else if (isWrong) {
                style = "bg-rose-500 text-white border-rose-500 animate-bounce";
              } else if (isSelected) {
                style = "bg-rose-500 text-white border-rose-500 ring-4 ring-rose-500/20 scale-105 shadow-lg";
              }

              return (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile)}
                  disabled={isMatched}
                  className={`p-5 rounded-2xl border-2 text-4xl sm:text-5xl font-bold flex flex-col items-center justify-center transition-all ${FONT_CLASSES[activeFont]} ${style}`}
                >
                  <span>{tile.display}</span>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Deck: Sounds (Independently Shuffled) */}
        <div className="space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 text-center pb-2 border-b border-slate-100 dark:border-slate-800">
            Sounds / Romanization
          </div>
          <div className="grid grid-cols-2 gap-3">
            {soundTiles.map(tile => {
              const isMatched = matchedCharIds.includes(tile.charId);
              const isSelected = selectedSound?.id === tile.id;
              const isWrong = wrongPair?.sId === tile.id;

              let style = "bg-slate-50 dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-indigo-400 dark:hover:border-indigo-600 hover:scale-[1.02]";

              if (isMatched) {
                style = "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 opacity-60 pointer-events-none";
              } else if (isWrong) {
                style = "bg-rose-500 text-white border-rose-500 animate-bounce";
              } else if (isSelected) {
                style = "bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-500/20 scale-105 shadow-lg";
              }

              return (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile)}
                  disabled={isMatched}
                  className={`p-5 rounded-2xl border-2 text-xl sm:text-2xl font-extrabold flex flex-col items-center justify-center transition-all ${style}`}
                >
                  <span>{tile.display}</span>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1" />}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Victory Dialog */}
      {isGameOver && (
        <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-8 rounded-3xl shadow-2xl text-center space-y-4 animate-fadeIn">
          <Trophy className="w-12 h-12 mx-auto text-amber-300" />
          <div>
            <h3 className="text-2xl font-black">Match Up Completed! 🎉</h3>
            <p className="text-sm opacity-90 mt-1">
              You matched all 6 pairs in {seconds} seconds with {moves} moves.
            </p>
          </div>
          <button
            onClick={initGame}
            className="px-8 py-3.5 rounded-2xl bg-white text-emerald-700 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all hover:scale-105"
          >
            Play Again
          </button>
        </div>
      )}

    </div>
  );
};
