import type { CharacterProgressMap } from '../hooks/useCharacterProgress';
import type { FontStyle } from '../types';

interface DashboardPageProps {
  progressMap: CharacterProgressMap;
  overallStats: {
    totalAttempts: number;
    totalCorrect: number;
    practicedCount: number;
    totalCount: number;
    masteredCount: number;
    overallAccuracy: number;
    overallMasteryPercent: number;
  };
  streakCount: number;
  totalPracticeTimeSeconds: number;
  activeFont: FontStyle;
  onSelectCharacter: (char: string) => void;
  onReviewMistakes: () => void;
  onStartPractice: () => void;
}

export function DashboardPage({
  progressMap,
  overallStats,
  streakCount,
  totalPracticeTimeSeconds,
  activeFont,
  onSelectCharacter,
  onReviewMistakes,
  onStartPractice,
}: DashboardPageProps) {
  const weakEntries = Object.values(progressMap)
    .filter((item) => item.attempts > 0 && item.mastery !== 'mastered')
    .sort((a, b) => a.confidence - b.confidence)
    .slice(0, 8);

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Dashboard</div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Track what is sticking and what needs review</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={onReviewMistakes} className="rounded-xl bg-rose-600 text-white px-4 py-2 text-sm font-bold">
            Review Mistakes
          </button>
          <button onClick={onStartPractice} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151c2c] px-4 py-2 text-sm font-bold">
            Practice
          </button>
        </div>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Accuracy" value={`${overallStats.overallAccuracy}%`} />
        <StatCard label="Mastered" value={`${overallStats.masteredCount}/${overallStats.totalCount}`} />
        <StatCard label="Attempts" value={overallStats.totalAttempts.toString()} />
        <StatCard label="Streak" value={streakCount.toString()} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Practice Summary</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-4">
              <div className="text-slate-500 dark:text-slate-400">Practiced</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">{overallStats.practicedCount}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-4">
              <div className="text-slate-500 dark:text-slate-400">Mastery</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">{overallStats.overallMasteryPercent}%</div>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-4 col-span-2">
              <div className="text-slate-500 dark:text-slate-400">Total Practice Time</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                {Math.round(totalPracticeTimeSeconds / 60)} min
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Weak Characters</h3>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {weakEntries.length > 0 ? weakEntries.map((entry) => (
              <button
                key={entry.character}
                onClick={() => onSelectCharacter(entry.character)}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 text-center"
                style={{ fontFamily: activeFont }}
              >
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{entry.character}</div>
                <div className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{entry.confidence}%</div>
              </button>
            )) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-sm text-slate-500 dark:text-slate-400">
                No weak characters yet. Start practicing to populate this list.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-5">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
