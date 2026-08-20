import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, RotateCcw, CheckCircle2, XCircle, ArrowRight, Volume2, HelpCircle } from 'lucide-react';
import { FontStyle, VocabularyWord } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { getDynamicShuffledWords } from '../../data/vocabularyData';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import confetti from 'canvas-confetti';

interface WordBuilderProps {
  activeFont: FontStyle;
  onPlayAudio: (text: string) => void;
  onFinish?: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const WordBuilder: React.FC<WordBuilderProps> = ({
  activeFont,
  onPlayAudio,
  onFinish
}) => {
  // Dynamically generated word session list (reshuffled every session)
  const sessionWords = useMemo(() => getDynamicShuffledWords(10), []);
  const [wordIndex, setWordIndex] = useState<number>(0);
  const currentWord = sessionWords[wordIndex] || sessionWords[0];

  const [selectedTiles, setSelectedTiles] = useState<{ id: string; char: string }[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isWrong, setIsWrong] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Generate available tiles (Word characters + 3 distractor characters)
  const availableTilePool = useMemo(() => {
    const targetChars = currentWord.chars;
    const distractorChars = HIRAGANA_DATA
      .map(c => c.character)
      .filter(c => !targetChars.includes(c));
    const wrongSelected = shuffle(distractorChars).slice(0, 3);
    const combined = [...targetChars, ...wrongSelected];

    return shuffle(combined.map((char, idx) => ({
      id: `tile_${idx}_${char}_${Date.now()}`,
      char
    })));
  }, [currentWord]);

  useEffect(() => {
    setSelectedTiles([]);
    setIsCompleted(false);
    setIsWrong(false);
  }, [wordIndex]);

  const handleTileClick = (tile: { id: string; char: string }) => {
    if (isCompleted) return;
    if (selectedTiles.some(t => t.id === tile.id)) return;

    onPlayAudio(tile.char);

    const nextSelected = [...selectedTiles, tile];
    setSelectedTiles(nextSelected);

    // Check if slots are filled
    if (nextSelected.length === currentWord.chars.length) {
      const builtJapanese = nextSelected.map(t => t.char).join('');
      if (builtJapanese === currentWord.japanese) {
        // CORRECT WORD BUILT
        setIsCompleted(true);
        setIsWrong(false);
        setScore(s => s + 1);
        onPlayAudio(builtJapanese);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } else {
        // WRONG WORD BUILT
        setIsWrong(true);
        setTimeout(() => setIsWrong(false), 800);
      }
    }
  };

  const handleRemoveTile = (index: number) => {
    if (isCompleted) return;
    setSelectedTiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    if (isCompleted) return;
    setSelectedTiles([]);
  };

  const handleNextWord = () => {
    if (wordIndex + 1 < sessionWords.length) {
      setWordIndex(w => w + 1);
    } else if (onFinish) {
      onFinish();
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-2 animate-fadeIn">
      
      {/* Top Header Controls */}
      <div className="bg-white dark:bg-[#151c2c] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Word Builder — Vocabulary Assembly</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Word {wordIndex + 1} of {sessionWords.length}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300">
            Score: {score}
          </span>
          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            title="Clear typed tiles"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Word Meaning Prompt Card */}
      <div className="bg-white dark:bg-[#151c2c] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-3">
        <div className="text-5xl sm:text-6xl">{currentWord.emoji}</div>
        
        {/* ENGLISH MEANING PROMPT */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Assemble Japanese Word For:
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            "{currentWord.english}"
          </h2>
        </div>

        {/* Built Word Slots Container */}
        <div className="pt-4 flex items-center justify-center gap-3">
          {currentWord.chars.map((_, idx) => {
            const filledTile = selectedTiles[idx];

            let slotStyle = "bg-slate-50 dark:bg-[#0b0f19] border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white";

            if (filledTile) {
              slotStyle = isCompleted
                ? "bg-emerald-500 text-white border-2 border-emerald-500 shadow-lg scale-105"
                : isWrong
                ? "bg-rose-500 text-white border-2 border-rose-500 animate-bounce"
                : "bg-indigo-600 text-white border-2 border-indigo-600 shadow-md";
            }

            return (
              <button
                key={idx}
                onClick={() => handleRemoveTile(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-4xl sm:text-5xl font-extrabold flex items-center justify-center transition-all ${FONT_CLASSES[activeFont]} ${slotStyle}`}
              >
                {filledTile?.char || ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Shuffled Hiragana Character Tile Selection Deck */}
      <div className="bg-white dark:bg-[#151c2c] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
          Tap Hiragana Tiles In Correct Order:
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {availableTilePool.map(tile => {
            const isUsed = selectedTiles.some(t => t.id === tile.id);

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                disabled={isUsed || isCompleted}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 text-3xl font-extrabold flex items-center justify-center transition-all ${FONT_CLASSES[activeFont]} ${
                  isUsed
                    ? 'opacity-20 border-slate-200 dark:border-slate-800 pointer-events-none'
                    : 'bg-slate-50 dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-indigo-500 hover:scale-110 active:scale-95 shadow-sm'
                }`}
              >
                {tile.char}
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Feedback Card */}
      {isCompleted && (
        <div className="p-5 rounded-3xl bg-emerald-500 text-white shadow-xl flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-white shrink-0" />
            <div>
              <div className="text-lg font-black">{currentWord.japanese} ({currentWord.romaji})</div>
              <div className="text-xs opacity-90">English: "{currentWord.english}"</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlayAudio(currentWord.japanese)}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white"
              title="Listen Pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleNextWord}
              className="px-5 py-3 rounded-xl bg-white text-emerald-700 font-extrabold text-sm shadow-md hover:bg-slate-100 transition-all flex items-center gap-1.5"
            >
              <span>Next Word</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
