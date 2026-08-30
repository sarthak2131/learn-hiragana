import React, { useState, useMemo, useRef } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
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
    setTimeout(() => setIsPlaying(false), 800);
  };

  const handleSelect = (choice: string) => {
    onAnswer(choice === question.correctAnswer, (Date.now() - startedAt.current) / 1000);
  };

  return (
    <section className="rounded-2xl bg-white dark:bg-[#111522] border border-[#D9DDF0] dark:border-[#252B40] p-6 sm:p-8 shadow-xs space-y-6 animate-pageTransition transition-colors duration-200">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5] dark:text-[#818CF8] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>READ IT — CHARACTER → SOUND</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#151827] dark:text-[#F8FAFC] mt-1">
            What sound does this character make?
          </h3>
        </div>

        <button
          onClick={handlePlayAudio}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-extrabold transition-all ${
            isPlaying
              ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white shadow-xs scale-105'
              : 'bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] text-[#4F46E5] dark:text-[#818CF8] border border-[#4F46E5]/20 dark:border-[#6366F1]/30 hover:bg-[#E8EAFF] dark:hover:bg-[rgba(99,102,241,0.20)]'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-white' : 'text-[#4F46E5] dark:text-[#6366F1]'}`} />
          <span>{isPlaying ? 'Playing...' : 'Play Sound'}</span>
        </button>
      </div>

      {/* Hero Character Display Panel (80-110px Hero Character) */}
      <div className="rounded-xl border border-[#D9DDF0] dark:border-[#252B40] bg-[#F4F5FF] dark:bg-[#0D1120] p-8 sm:p-10 text-center relative group overflow-hidden">
        <button
          onClick={handlePlayAudio}
          className="text-8xl sm:text-[100px] font-black text-[#151827] dark:text-[#F8FAFC] transition-transform hover:scale-105 active:scale-95 inline-block cursor-pointer select-none leading-none"
          style={{ fontFamily: fontFamilies[activeFont] }}
          title="Tap to listen"
        >
          {question.character.character}
        </button>

        <div className="mt-4 text-xs font-semibold text-[#475069] dark:text-[#A8B0C2]">
          {question.character.exampleWord ? `Example: ${question.character.exampleWord}` : 'Tap character to listen'}
        </div>
      </div>

      {/* 2x2 Desktop Answer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className="h-[64px] rounded-xl border border-[#D9DDF0] dark:border-[#252B40] bg-white dark:bg-[#111522] text-xl font-extrabold text-[#151827] dark:text-[#F8FAFC] hover:border-[#4F46E5] dark:hover:border-[#6366F1] hover:bg-[#EEF2FF] dark:hover:bg-[rgba(99,102,241,0.08)] hover:-translate-y-0.5 active:scale-98 transition-all shadow-xs flex items-center justify-center font-mono"
          >
            "{option}"
          </button>
        ))}
      </div>
    </section>
  );
}
