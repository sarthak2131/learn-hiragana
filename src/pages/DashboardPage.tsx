import type { CharacterProgressMap } from '../hooks/useCharacterProgress';
import type { FontStyle } from '../types';
import { Sparkles, Trophy, Target, Zap, Clock, ArrowRight } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto space-y-6 py-4 animate-pageTransition">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#111522] p-6 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xs transition-colors duration-200">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5] dark:text-[#818CF8] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PROGRESS ANALYTICS</span>
          </div>
          <h2 className="text-2xl font-black text-[#151827] dark:text-[#F8FAFC] mt-1">
            Track what is sticking and what needs review
          </h2>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={onReviewMistakes} 
            className="rounded-lg bg-[#4F46E5] dark:bg-[#6366F1] hover:bg-[#4338CA] dark:hover:bg-[#818CF8] text-white px-4 py-2.5 text-xs font-black shadow-xs transition-all hover:scale-105"
          >
            Review Weak Chars
          </button>
          <button 
            onClick={onStartPractice} 
            className="rounded-lg border border-[#D9DDF0] dark:border-[#343B58] bg-[#F4F5FF] dark:bg-[#171C2D] hover:bg-slate-200 dark:hover:bg-[#171C2D]/80 text-[#151827] dark:text-[#F8FAFC] px-4 py-2.5 text-xs font-black transition-all hover:scale-105"
          >
            Start Practice →
          </button>
        </div>
      </div>

      {/* Top 4 Stats Grid - Monochromatic Indigo */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Accuracy" value={`${overallStats.overallAccuracy}%`} icon={Target} color="text-[#4F46E5] dark:text-[#6366F1]" />
        <StatCard label="Mastered Chars" value={`${overallStats.masteredCount}/${overallStats.totalCount}`} icon={Trophy} color="text-[#4F46E5] dark:text-[#818CF8]" />
        <StatCard label="Total Attempts" value={overallStats.totalAttempts.toString()} icon={Zap} color="text-[#4F46E5] dark:text-[#6366F1]" />
        <StatCard label="Current Streak" value={`${streakCount} days`} icon={Clock} color="text-[#4F46E5] dark:text-[#818CF8]" />
      </section>

      {/* Practice Summary & Weak Characters */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Practice Summary */}
        <div className="rounded-2xl bg-white dark:bg-[#111522] border border-[#D9DDF0] dark:border-[#252B40] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#151827] dark:text-[#F8FAFC]">
            Practice Summary
          </h3>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-[#F4F5FF] dark:bg-[#0D1120] border border-[#D9DDF0] dark:border-[#252B40] p-4">
              <div className="text-xs font-bold text-[#475069] dark:text-[#A8B0C2]">Characters Practiced</div>
              <div className="text-2xl font-black text-[#151827] dark:text-[#F8FAFC] mt-1">{overallStats.practicedCount}</div>
            </div>
            
            <div className="rounded-xl bg-[#F4F5FF] dark:bg-[#0D1120] border border-[#D9DDF0] dark:border-[#252B40] p-4">
              <div className="text-xs font-bold text-[#475069] dark:text-[#A8B0C2]">Mastery Progress</div>
              <div className="text-2xl font-black text-[#4F46E5] dark:text-[#818CF8] mt-1">{overallStats.overallMasteryPercent}%</div>
            </div>
            
            <div className="rounded-xl bg-[#F4F5FF] dark:bg-[#0D1120] border border-[#D9DDF0] dark:border-[#252B40] p-4 col-span-2">
              <div className="text-xs font-bold text-[#475069] dark:text-[#A8B0C2]">Total Time Spent Practicing</div>
              <div className="text-2xl font-black text-[#151827] dark:text-[#F8FAFC] mt-1">
                {Math.round(totalPracticeTimeSeconds / 60)} min
              </div>
            </div>
          </div>
        </div>

        {/* Weak Characters */}
        <div className="rounded-2xl bg-white dark:bg-[#111522] border border-[#D9DDF0] dark:border-[#252B40] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#151827] dark:text-[#F8FAFC]">
              Characters Needing Review
            </h3>
            <span className="text-xs text-[#69738A] dark:text-[#737D94]">{weakEntries.length} items</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {weakEntries.length > 0 ? (
              weakEntries.map((entry) => (
                <button
                  key={entry.character}
                  onClick={() => onSelectCharacter(entry.character)}
                  className="rounded-xl border border-[#D9DDF0] dark:border-[#252B40] bg-[#F4F5FF] dark:bg-[#0D1120] hover:border-[#4F46E5] dark:hover:border-[#6366F1] p-3.5 text-center transition-all hover:scale-105"
                  style={{ fontFamily: activeFont }}
                >
                  <div className="text-3xl font-bold text-[#151827] dark:text-[#F8FAFC]">{entry.character}</div>
                  <div className="mt-1 text-xs font-extrabold text-[#4F46E5] dark:text-[#818CF8]">{entry.confidence}% confidence</div>
                </button>
              ))
            ) : (
              <div className="col-span-full rounded-xl border border-dashed border-[#D9DDF0] dark:border-[#343B58] p-6 text-center text-xs text-[#475069] dark:text-[#A8B0C2] space-y-2">
                <p className="font-bold">No weak characters identified yet 🎉</p>
                <p>Complete active recall questions to track accuracy.</p>
                <button
                  onClick={onStartPractice}
                  className="px-4 py-2 rounded-lg bg-[#4F46E5] dark:bg-[#6366F1] text-white text-xs font-bold inline-flex items-center gap-1.5 mt-2"
                >
                  <span>Start Practice Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </section>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="rounded-xl bg-white dark:bg-[#111522] border border-[#D9DDF0] dark:border-[#252B40] p-5 shadow-xs flex flex-col justify-between h-[100px] transition-colors duration-200">
      <div className="flex items-center justify-between text-xs font-extrabold text-[#475069] dark:text-[#A8B0C2]">
        <span>{label}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="text-2xl sm:text-3xl font-black text-[#151827] dark:text-[#F8FAFC]">
        {value}
      </div>
    </div>
  );
}
