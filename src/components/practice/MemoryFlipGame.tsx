import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, RotateCcw, Trophy, CheckCircle2 } from 'lucide-react';
import { FontStyle, HiraganaCharacter } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import confetti from 'canvas-confetti';

interface MemoryFlipGameProps {
  activeFont: FontStyle;
  selectedRowIds: string[];
  onPlayAudio: (text: string) => void;
  onFinish?: () => void;
}

interface FlipCard {
  id: string;
  charId: string;
  display: string;
  type: 'hiragana' | 'sound';
  characterObj: HiraganaCharacter;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const MemoryFlipGame: React.FC<MemoryFlipGameProps> = ({
  activeFont,
  selectedRowIds,
  onPlayAudio,
}) => {
  const [cards, setCards] = useState<FlipCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<FlipCard[]>([]);
  const [wrongPairIds, setWrongPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const initGame = () => {
    let pool = HIRAGANA_DATA.filter(c => selectedRowIds.includes(c.row));
    if (pool.length < 6) pool = HIRAGANA_DATA;

    const chosen = shuffle(pool).slice(0, 6);

    const hCards: FlipCard[] = chosen.map(c => ({
      id: `h_card_${c.id}`,
      charId: c.id,
      display: c.character,
      type: 'hiragana',
      characterObj: c,
      isFlipped: false,
      isMatched: false
    }));

    const sCards: FlipCard[] = chosen.map(c => ({
      id: `s_card_${c.id}`,
      charId: c.id,
      display: c.romanization,
      type: 'sound',
      characterObj: c,
      isFlipped: false,
      isMatched: false
    }));

    const combined = shuffle([...hCards, ...sCards]);
    setCards(combined);
    setFlippedCards([]);
    setWrongPairIds([]);
    setMoves(0);
    setSeconds(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, [selectedRowIds]);

  // Timer interval
  useEffect(() => {
    if (isGameOver || cards.length === 0) return;
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isGameOver, cards]);

  const handleCardClick = (card: FlipCard) => {
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2 || wrongPairIds.length > 0) return;

    onPlayAudio(card.characterObj.character);

    // Flip target card
    const updatedCards = cards.map(c => c.id === card.id ? { ...c, isFlipped: true } : c);
    setCards(updatedCards);

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [card1, card2] = newFlipped;

      if (card1.charId === card2.charId) {
        // SUCCESS MATCH
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.charId === card1.charId ? { ...c, isMatched: true } : c)));
          setFlippedCards([]);

          // Check if all cards matched
          const remainingUnmatched = updatedCards.filter(c => !c.isMatched && c.charId !== card1.charId);
          if (remainingUnmatched.length === 0) {
            setIsGameOver(true);
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          }
        }, 400);
      } else {
        // MISMATCH
        setWrongPairIds([card1.id, card2.id]);
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c)));
          setFlippedCards([]);
          setWrongPairIds([]);
        }, 900);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2 animate-fadeIn">
      
      {/* Header Controls */}
      <div className="bg-white dark:bg-[#151c2c] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Memory Flip Cards — Concentration Pairs</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Flip face-down cards & find 6 pairs
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Time: <span className="text-purple-600 dark:text-purple-400 font-mono">{seconds}s</span> | Moves: <span className="text-purple-600 dark:text-purple-400">{moves}</span>
          </div>

          <button
            onClick={initGame}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Flip Card Grid Deck */}
      <div className="bg-white dark:bg-[#151c2c] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 sm:gap-4">
          {cards.map(card => {
            const isWrong = wrongPairIds.includes(card.id);

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={card.isMatched || card.isFlipped}
                className={`w-full aspect-[3/4] rounded-2xl border-2 transition-all transform perspective-1000 duration-300 relative flex flex-col items-center justify-center ${
                  card.isMatched
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 opacity-60 pointer-events-none'
                    : isWrong
                    ? 'bg-rose-500 text-white border-rose-500 animate-bounce'
                    : card.isFlipped
                    ? 'bg-slate-50 dark:bg-[#0b0f19] border-purple-500 text-slate-900 dark:text-white shadow-lg scale-105'
                    : 'bg-gradient-to-br from-purple-600 to-indigo-700 border-purple-500 text-white hover:scale-105 shadow-md'
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <div className={`flex flex-col items-center justify-center ${card.type === 'hiragana' ? FONT_CLASSES[activeFont] : ''}`}>
                    <span className={card.type === 'hiragana' ? 'text-4xl sm:text-5xl font-extrabold' : 'text-2xl sm:text-3xl font-extrabold'}>
                      {card.display}
                    </span>
                    {card.isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1" />}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Sparkles className="w-6 h-6 text-purple-200" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-200">
                      Tap Flip
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Victory Celebration Banner */}
      {isGameOver && (
        <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white p-8 rounded-3xl shadow-2xl text-center space-y-4 animate-fadeIn">
          <Trophy className="w-12 h-12 mx-auto text-amber-300" />
          <div>
            <h3 className="text-2xl font-black">Memory Flip Completed! 🎉</h3>
            <p className="text-sm opacity-90 mt-1">
              You uncovered all 6 pairs in {seconds} seconds with {moves} moves.
            </p>
          </div>
          <button
            onClick={initGame}
            className="px-8 py-3.5 rounded-2xl bg-white text-purple-700 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all hover:scale-105"
          >
            Play Again
          </button>
        </div>
      )}

    </div>
  );
};
