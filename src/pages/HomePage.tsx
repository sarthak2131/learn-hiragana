import React from 'react';
import { 
  Play, 
  Grid, 
  Sparkles, 
  Target, 
  Type, 
  Zap, 
  Edit3, 
  HelpCircle, 
  BookOpen, 
  Eye, 
  Grid2X2, 
  Layers, 
  Shuffle, 
  ArrowRight
} from 'lucide-react';
import { FontStyle, UserSettings, PracticeMode } from '../types/index';
import { FONT_CLASSES, FONT_DESCRIPTIONS } from '../hooks/useFont';

interface HomePageProps {
  currentFont: FontStyle;
  onOpenFontSelector: () => void;
  streakCount: number;
  todayCount: number;
  dailyGoal: number;
  settings: UserSettings;
  onStartPractice: (mode?: PracticeMode) => void;
  onViewChart: () => void;
  onViewWriting: () => void;
  onViewDashboard: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentFont,
  onOpenFontSelector,
  todayCount,
  dailyGoal,
  settings,
  onStartPractice,
  onViewChart,
}) => {
  const goalProgress = Math.min(Math.round((todayCount / dailyGoal) * 100), 100);

  const games: { id: PracticeMode; title: string; subTitle: string; desc: string; icon: any; badgeColor: string }[] = [
    { id: 'read-it', title: 'Read It', subTitle: 'Character → Sound', desc: 'See さ, pick sound "sa"', icon: HelpCircle, badgeColor: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' },
    { id: 'build-it', title: 'Build It', subTitle: 'Sound → Character', desc: 'See "shi", pick し', icon: BookOpen, badgeColor: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' },
    { id: 'pure-recall', title: 'Pure Recall', subTitle: 'True Recall', desc: 'Mental recall without choices', icon: Eye, badgeColor: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
    { id: 'write-it', title: 'Write It', subTitle: 'Handwriting', desc: 'Draw Hiragana on canvas', icon: Edit3, badgeColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
    { id: 'match-up', title: 'Match Up', subTitle: 'Matching', desc: 'Interactive 2-column matching game', icon: Grid2X2, badgeColor: 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400' },
    { id: 'spot-difference', title: 'Spot Difference', subTitle: 'Similar Chars', desc: 'Distinguish さ vs き, ぬ vs め', icon: Layers, badgeColor: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400' },
    { id: 'speed-recall', title: 'Speed Recall', subTitle: 'Fast Recognition', desc: 'Timer recall challenge', icon: Zap, badgeColor: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
    { id: 'mixed-challenge', title: 'Mixed Challenge', subTitle: 'Complete Mastery', desc: 'Random mix of all question types', icon: Shuffle, badgeColor: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' },
    { id: 'flashcard', title: 'Flashcards', subTitle: 'Leitner Cards', desc: 'Interactive 3D study cards', icon: Sparkles, badgeColor: 'bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 sm:py-8 animate-fadeIn">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#151c2c] to-rose-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className={`absolute -right-8 -bottom-10 text-[200px] sm:text-[280px] font-bold opacity-5 pointer-events-none select-none text-rose-500 ${FONT_CLASSES[currentFont]}`}>
          あ
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Active-Recall Hiragana Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Master Hiragana.<br />
            <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
              One character at a time.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
            Choose from 9 interactive practice games. Train recognition, mental recall, and handwriting with live Japanese font switching.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => onStartPractice('read-it')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-base shadow-xl shadow-rose-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2.5"
            >
              <span>Start Practicing</span>
              <Play className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={onViewChart}
              className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/15 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Grid className="w-5 h-5 text-amber-400" />
              <span>View Hiragana Chart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Select Practice Game Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Choose A Game To Play 🎮
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any game mode to begin active recall practice
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {games.map((g) => {
            const Icon = g.icon;
            return (
              <button
                key={g.id}
                onClick={() => onStartPractice(g.id)}
                className="bg-white dark:bg-[#151c2c] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-400 dark:hover:border-rose-600 transition-all text-left group flex flex-col justify-between hover:scale-[1.02]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${g.badgeColor}`}>
                      {g.subTitle}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {g.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {g.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                  <span>Play Game</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Goal Progress Bar & Active Font Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white dark:bg-[#151c2c] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Target className="w-4 h-4 text-rose-500" />
              <span>Today's Practice Goal</span>
            </div>

            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              {todayCount} / {dailyGoal} Questions
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>{goalProgress}% Completed</span>
              <span>{goalProgress >= 100 ? 'Goal Achieved! 🎉' : `${dailyGoal - todayCount} questions remaining`}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenFontSelector}
          className="bg-white dark:bg-[#151c2c] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-400 dark:hover:border-rose-600 transition-all text-left group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Practice Font</span>
            <Type className="w-4 h-4 text-rose-500" />
          </div>

          <div className="my-2">
            <div className={`text-3xl font-bold text-slate-900 dark:text-white ${FONT_CLASSES[currentFont]}`}>
              {FONT_DESCRIPTIONS[currentFont].jpName}
            </div>
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {FONT_DESCRIPTIONS[currentFont].title} ({FONT_DESCRIPTIONS[currentFont].styleName})
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium group-hover:text-rose-500 transition-colors">
            Tap to change practice font →
          </div>
        </button>
      </div>

    </div>
  );
};
