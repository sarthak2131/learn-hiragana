import React, { useState, useMemo, useRef } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import type { FontStyle, Question } from '../../types';

interface CharacterToSoundProps {
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

export function CharacterToSound({ question, activeFont, onAnswer, onPlayAudio }: CharacterToSoundProps) {
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
          <div className="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Read It — Character → Sound</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            What sound does this character make?
          </h3>
        </div>

        <button
          onClick={handlePlayAudio}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition-all ${
            isPlaying
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30 scale-105 ring-4 ring-rose-500/20'
              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-white' : 'text-rose-500'}`} />
          <span>{isPlaying ? 'Playing...' : 'Play Sound'}</span>
        </button>
      </div>

      <div className="rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] p-8 sm:p-12 text-center relative group overflow-hidden">
        <button
          onClick={handlePlayAudio}
          className="text-8xl sm:text-9xl font-black text-slate-900 dark:text-white transition-transform hover:scale-105 active:scale-95 inline-block cursor-pointer"
          style={{ fontFamily: fontFamilies[activeFont] }}
          title="Click to play audio"
        >
          {question.character.character}
        </button>

        <div className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {question.character.exampleWord ? `Example: ${question.character.exampleWord}` : 'Tap character to hear pronunciation'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151c2c] px-5 py-4 text-xl font-extrabold text-slate-900 dark:text-white hover:border-rose-500 dark:hover:border-rose-500 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
