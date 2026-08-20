import { Play, RotateCcw } from 'lucide-react';
import { useRef, useState } from 'react';
import type { FontStyle, Question } from '../../types';

interface FlashcardProps {
  question: Question;
  activeFont: FontStyle;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
}

export function Flashcard({ question, activeFont, onAnswer, onPlayAudio }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const startedAt = useRef(Date.now());

  const answer = (isCorrect: boolean) => {
    onAnswer(isCorrect, (Date.now() - startedAt.current) / 1000);
  };

  return (
    <section className="rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Flashcard</div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Flip and test your memory</h3>
        </div>
        <button
          onClick={() => onPlayAudio(question.character.romanization)}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-200 px-3 py-2 text-sm font-bold"
        >
          <Play className="w-4 h-4" />
          Play
        </button>
      </div>

      <button
        onClick={() => setFlipped((prev) => !prev)}
        className="w-full rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 text-center transition-transform hover:scale-[1.01]"
      >
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          {flipped ? 'Answer' : 'Front'}
        </div>
        <div className="mt-4 text-7xl sm:text-8xl font-black text-slate-900 dark:text-white" style={{ fontFamily: activeFont }}>
          {flipped ? question.correctAnswer : question.character.character}
        </div>
        <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {flipped ? 'Did you get it right?' : 'Tap to reveal the answer.'}
        </div>
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            setFlipped(false);
            startedAt.current = Date.now();
          }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-bold inline-flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={() => answer(true)}
          className="rounded-2xl bg-emerald-600 text-white px-4 py-3 text-sm font-bold"
        >
          I knew it
        </button>
        <button
          onClick={() => answer(false)}
          className="rounded-2xl bg-rose-600 text-white px-4 py-3 text-sm font-bold"
        >
          I missed it
        </button>
      </div>
    </section>
  );
}
