import { Play } from 'lucide-react';
import { useRef, useState } from 'react';
import type { FontStyle, Question } from '../../types';

interface TrueRecallProps {
  question: Question;
  activeFont: FontStyle;
  isReverse: boolean;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
}

export function TrueRecall({ question, activeFont, isReverse, onAnswer, onPlayAudio }: TrueRecallProps) {
  const startedAt = useRef(Date.now());
  const [value, setValue] = useState('');

  const expected = isReverse ? question.character.character : question.character.romanization;

  const submit = () => {
    const normalized = value.trim().toLowerCase();
    onAnswer(normalized === expected.toLowerCase(), (Date.now() - startedAt.current) / 1000);
  };

  return (
    <section className="rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Pure Recall</div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Type the answer from memory</h3>
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
        <div className="text-7xl sm:text-8xl font-black text-slate-900 dark:text-white" style={{ fontFamily: activeFont }}>
          {isReverse ? question.character.romanization : question.character.character}
        </div>
        <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {isReverse ? 'Type the hiragana' : 'Type the romanization'}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              submit();
            }
          }}
          placeholder="Your answer"
          className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-lg"
        />
        <button
          onClick={submit}
          className="rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 text-sm font-bold"
        >
          Check
        </button>
      </div>
    </section>
  );
}
