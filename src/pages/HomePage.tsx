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
  ArrowRight,
  Radio,
  ListOrdered,
  CheckCheck
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
  onStartPractice,
  onViewChart,
}) => {
  const goalProgress = Math.min(Math.round((todayCount / dailyGoal) * 100), 100);

  // ALL game category badges consume the central Indigo Monochromatic design system
  const games: { id: PracticeMode; title: string; category: string; desc: string; icon: any; isFeatured?: boolean }[] = [
    { id: 'read-it', title: 'Read It', category: 'Recall', desc: 'See さ, pick sound "sa"', icon: HelpCircle },
    { id: 'build-it', title: 'Build It', category: 'Recall', desc: 'See "shi", pick し', icon: BookOpen },
    { id: 'match-up', title: 'Match Up', category: 'Interactive Matching', desc: 'Match Hiragana tiles with their sounds', icon: Grid2X2, isFeatured: true },
    { id: 'true-false', title: 'Rapid True / False', category: 'Speed', desc: 'Is し = "shi"? Binary test in 2s', icon: CheckCheck },
    { id: 'sequence-memory', title: 'Sequence Memory', category: 'Audio', desc: 'Listen to spoken sounds & tap in order', icon: ListOrdered },
    { id: 'ear-training', title: 'Ear Training', category: 'Audio', desc: 'Listen to spoken sound & pick character', icon: Radio },
    { id: 'pure-recall', title: 'Pure Recall', category: 'Recall', desc: 'Mental recall without choices', icon: Eye },
    { id: 'write-it', title: 'Write It', category: 'Writing', desc: 'Draw Hiragana on canvas', icon: Edit3 },
    { id: 'spot-difference', title: 'Spot Difference', category: 'Recall', desc: 'Distinguish さ vs き, ぬ vs め', icon: Layers },
    { id: 'speed-recall', title: 'Speed Recall', category: 'Speed', desc: 'Timer recall challenge up to 3x', icon: Zap },
    { id: 'mixed-challenge', title: 'Mixed Challenge', category: 'Mastery', desc: 'Random mix of all question types', icon: Shuffle },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 sm:py-8 animate-pageTransition">
      
      {/* Monochromatic Indigo Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-[#111522] text-[#151827] dark:text-[#F8FAFC] rounded-2xl p-8 sm:p-12 border border-[#D9DDF0] dark:border-[#252B40] shadow-sm dark:shadow-md transition-colors duration-200">
        
        {/* Extremely Subtle Low-Opacity Indigo Background Watermark Character */}
        <div className={`absolute -right-6 -bottom-12 text-[220px] sm:text-[300px] font-black opacity-[0.04] dark:opacity-[0.05] pointer-events-none select-none text-[#4F46E5] dark:text-[#6366F1] ${FONT_CLASSES[currentFont]}`}>
          あ
        </div>

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] border border-[#4F46E5]/20 dark:border-[#6366F1]/30 text-[#4F46E5] dark:text-[#818CF8] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACTIVE RECALL STUDIO</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.15]">
            Master Hiragana.<br />
            <span className="text-[#4F46E5] dark:text-[#818CF8]">
              One character at a time.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#475069] dark:text-[#A8B0C2] font-medium leading-relaxed max-w-xl">
            Learn Japanese Hiragana through active recall, audio practice, handwriting, and interactive games in a clean Indigo workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => onStartPractice('read-it')}
              className="px-8 py-3.5 rounded-lg bg-[#4F46E5] dark:bg-[#6366F1] hover:bg-[#4338CA] dark:hover:bg-[#818CF8] text-white font-extrabold text-sm shadow-md shadow-[#4F46E5]/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Start Practicing</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onViewChart}
              className="px-6 py-3.5 rounded-lg bg-[#F4F5FF] dark:bg-[#171C2D] hover:bg-slate-200 dark:hover:bg-[#171C2D]/80 text-[#151827] dark:text-[#F8FAFC] font-bold text-sm border border-[#D9DDF0] dark:border-[#343B58] transition-all flex items-center justify-center gap-2"
            >
              <Grid className="w-4 h-4 text-[#4F46E5] dark:text-[#818CF8]" />
              <span>View Hiragana Chart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Continue Learning / Quick Start Card */}
      <div className="bg-white dark:bg-[#111522] p-6 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#4F46E5] dark:text-[#818CF8]">
            {todayCount > 0 ? 'CONTINUE LEARNING' : 'RECOMMENDED START'}
          </div>
          <h3 className="text-base font-extrabold text-[#151827] dark:text-[#F8FAFC]">
            {todayCount > 0 ? 'Keep Your Momentum Going 🔥' : 'Start Your First Session'}
          </h3>
          <p className="text-xs text-[#475069] dark:text-[#A8B0C2]">
            {todayCount > 0 
              ? `You've answered ${todayCount} questions today. Continue practicing to hit your ${dailyGoal} daily goal.` 
              : 'Choose a game mode below and begin practicing Japanese Hiragana mora.'}
          </p>
        </div>

        <button
          onClick={() => onStartPractice('read-it')}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#4F46E5] dark:bg-[#6366F1] hover:bg-[#4338CA] dark:hover:bg-[#818CF8] text-white font-extrabold text-xs shadow-sm transition-all hover:scale-105 flex items-center justify-center gap-2 shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{todayCount > 0 ? 'Continue Session →' : 'Start Session →'}</span>
        </button>
      </div>

      {/* Practice Modes Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#151827] dark:text-[#F8FAFC]">
            Choose A Game Mode 🎮
          </h2>
          <p className="text-xs text-[#475069] dark:text-[#A8B0C2] mt-0.5">
            Select any game mode to begin active recall practice
          </p>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {games.map((g) => {
            const Icon = g.icon;
            const isFeatured = g.isFeatured;

            return (
              <button
                key={g.id}
                onClick={() => onStartPractice(g.id)}
                className={`p-4 sm:p-5 rounded-xl border transition-all text-left group flex flex-col justify-between hover:-translate-y-0.5 h-[140px] ${
                  isFeatured
                    ? 'bg-gradient-to-br from-[#EEF2FF] dark:from-[#171C2D] to-white dark:to-[#111522] border-[#4F46E5] dark:border-[#6366F1] shadow-xs'
                    : 'bg-white dark:bg-[#111522] border-[#D9DDF0] dark:border-[#252B40] hover:border-[#B8BDE0] dark:hover:border-[#343B58] shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                      isFeatured 
                        ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white border-[#4F46E5] dark:border-[#6366F1]' 
                        : 'bg-[#F4F5FF] dark:bg-[#0D1120] border-[#D9DDF0] dark:border-[#252B40] text-[#151827] dark:text-[#F8FAFC] group-hover:bg-[#4F46E5] dark:group-hover:bg-[#6366F1] group-hover:text-white transition-colors'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Indigo Monochromatic Badge for ALL Categories */}
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] text-[#4338CA] dark:text-[#818CF8] border border-[#4F46E5]/20 dark:border-[#6366F1]/30">
                      {g.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-[#151827] dark:text-[#F8FAFC] group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8] transition-colors">
                    {g.title}
                  </h3>
                  <p className="text-xs text-[#475069] dark:text-[#A8B0C2] mt-0.5 line-clamp-1">
                    {g.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] pt-2 border-t border-[#D9DDF0]/60 dark:border-[#252B40]/60">
                  <span>Play Game</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Goal Progress Bar & Active Font Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Goal Progress */}
        <div className="md:col-span-2 bg-white dark:bg-[#111522] p-6 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#151827] dark:text-[#F8FAFC]">
              <Target className="w-4 h-4 text-[#4F46E5] dark:text-[#6366F1]" />
              <span>Today's Practice Goal</span>
            </div>

            <span className="text-xs font-extrabold px-3 py-1 rounded-md bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] text-[#4F46E5] dark:text-[#818CF8] border border-[#4F46E5]/20 dark:border-[#6366F1]/30">
              {todayCount} / {dailyGoal} Questions
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full h-3 bg-[#F4F5FF] dark:bg-[#0D1120] rounded-full overflow-hidden border border-[#D9DDF0] dark:border-[#252B40]">
              <div 
                className="h-full bg-[#4F46E5] dark:bg-[#6366F1] rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-semibold text-[#475069] dark:text-[#A8B0C2]">
              <span>{goalProgress}% Completed</span>
              <span>{goalProgress >= 100 ? 'Goal Achieved! 🎉' : `${dailyGoal - todayCount} questions remaining`}</span>
            </div>
          </div>
        </div>

        {/* Practice Font Widget */}
        <button
          onClick={onOpenFontSelector}
          className="bg-white dark:bg-[#111522] p-6 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] hover:border-[#B8BDE0] dark:hover:border-[#343B58] transition-all text-left group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#475069] dark:text-[#A8B0C2]">PRACTICE FONT</span>
            <Type className="w-4 h-4 text-[#4F46E5] dark:text-[#6366F1]" />
          </div>

          <div className="my-2">
            <div className={`text-3xl font-bold text-[#151827] dark:text-[#F8FAFC] ${FONT_CLASSES[currentFont]}`}>
              {FONT_DESCRIPTIONS[currentFont].jpName}
            </div>
            <div className="text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] mt-0.5">
              {FONT_DESCRIPTIONS[currentFont].title} ({FONT_DESCRIPTIONS[currentFont].styleName})
            </div>
          </div>

          <div className="text-xs text-[#475069] dark:text-[#A8B0C2] font-medium group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8] transition-colors">
            Tap to change practice font →
          </div>
        </button>
      </div>

    </div>
  );
};
