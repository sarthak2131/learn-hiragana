import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import type { FontStyle, SessionStats } from '../../types';

interface SessionResultsProps {
  stats: SessionStats;
  activeFont: FontStyle;
  onPracticeMistakes: () => void;
  onTryAgain: () => void;
  onChangeSetup: () => void;
  onGoHome: () => void;
}

export function SessionResults({
  stats,
  activeFont,
  onPracticeMistakes,
  onTryAgain,
  onChangeSetup,
  onGoHome,
}: SessionResultsProps) {
  return (
    <section className="max-w-3xl mx-auto rounded-[2rem] bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 dark:bg-rose-950/40 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-rose-700 dark:text-rose-200">
          <Sparkles className="w-3.5 h-3.5" />
          Session Complete
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white">Nice work, keep the momentum going.</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Results are based on the active recall session you just finished.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="Score" value={`${stats.scorePercent}%`} />
        <ResultCard label="Correct" value={stats.correctAnswers.toString()} />
        <ResultCard label="Missed" value={stats.incorrectAnswers.toString()} />
        <ResultCard label="Best Streak" value={stats.bestStreak.toString()} />
      </div>

      <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Missed Characters</div>
        <div className="mt-3 flex flex-wrap gap-2" style={{ fontFamily: activeFont }}>
          {stats.missedCharacters.length > 0 ? stats.missedCharacters.map((char) => (
            <span key={char} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-lg font-bold">
              {char}
            </span>
          )) : (
            <span className="text-sm text-slate-500 dark:text-slate-400">No misses. That was a clean run.</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={onPracticeMistakes} className="rounded-2xl bg-rose-600 text-white px-4 py-3 text-sm font-bold inline-flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Review Mistakes
        </button>
        <button onClick={onTryAgain} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-bold">
          Try Again
        </button>
        <button onClick={onChangeSetup} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-bold inline-flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Change Setup
        </button>
        <button onClick={onGoHome} className="rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 text-sm font-bold">
          Home
        </button>
      </div>
    </section>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-center">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
