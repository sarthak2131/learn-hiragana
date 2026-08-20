import { Play } from 'lucide-react';
import { useMemo, useRef } from 'react';
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

  const handleSelect = (choice: string) => {
    onAnswer(choice === question.correctAnswer, (Date.now() - startedAt.current) / 1000);
  };

  return (
    <section className="rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Read It</div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">What sound does this character make?</h3>
        </div>
        <button
          onClick={() => onPlayAudio(question.character.romanization)}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-200 px-3 py-2 text-sm font-bold"
        >
          <Play className="w-4 h-4" />
          Play
        </button>
      </div>

      <div className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 text-center">
        <div className="text-7xl sm:text-8xl font-black text-slate-900 dark:text-white" style={{ fontFamily: fontFamilies[activeFont] }}>
          {question.character.character}
        </div>
        <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {question.character.exampleWord ?? question.prompt}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-4 text-lg font-bold text-slate-900 dark:text-white hover:border-rose-400 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
