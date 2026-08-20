import React, { useState, useMemo, useRef } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import type { FontStyle, Question } from '../../types';

interface SoundToCharacterProps {
  question: Question;
  activeFont: FontStyle;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
}

const fontFamilies: Record<FontStyle, string> = {
  kyokasho: '"Klee One", "Noto Sans JP", sans-serif',
  mincho: '"Shippori Mincho", serif',
  gothic: '"Zen Maru Gothic", sans-serif',
};

export function SoundToCharacter({ question, activeFont, onAnswer, onPlayAudio }: SoundToCharacterProps) {
  const startedAt = useRef(Date.now());
  const options = useMemo(() => question.options ?? [], [question.options]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayAudio = () => {
    setIsPlaying(true);
    onPlayAudio(question.character.character);
    setTimeout(() => setIsPlaying(false), 1200);
  };

  const handleSelect = (choice: string) => {
    onAnswer(choice === question.correctAnswer, (Date.now() - startedAt.current) / 1000);
  };

  return (
    <section className="rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Build It — Sound → Character</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Pick the matching Hiragana
          </h3>
        </div>

        <button
          onClick={handlePlayAudio}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition-all ${
            isPlaying
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105 ring-4 ring-indigo-500/20'
              : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-white' : 'text-indigo-500'}`} />
          <span>{isPlaying ? 'Playing...' : 'Play Sound'}</span>
        </button>
      </div>

      <div className="rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] p-8 sm:p-10 text-center relative group">
        <div className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400">
          "{question.prompt}"
        </div>
        <div className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          Select the correct Hiragana character below
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151c2c] px-5 py-5 text-4xl font-extrabold text-slate-900 dark:text-white hover:border-indigo-500 dark:hover:border-indigo-500 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
            style={{ fontFamily: fontFamilies[activeFont] }}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
