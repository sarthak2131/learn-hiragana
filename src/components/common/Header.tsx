import { Bell, Menu, Settings, Sparkles } from 'lucide-react';
import type { FontStyle, UserSettings } from '../../types';

interface HeaderProps {
  currentFont: FontStyle;
  onOpenFontSelector: () => void;
  streakCount: number;
  todayCount: number;
  dailyGoal: number;
  settings: UserSettings;
  onUpdateSettings: (next: Partial<UserSettings>) => void;
  onOpenSettings: () => void;
  onNavigateHome: () => void;
}

const fontLabel: Record<FontStyle, string> = {
  kyokasho: 'Kyokasho',
  mincho: 'Mincho',
  gothic: 'Gothic',
};

export function Header({
  currentFont,
  onOpenFontSelector,
  streakCount,
  todayCount,
  dailyGoal,
  settings,
  onUpdateSettings,
  onOpenSettings,
  onNavigateHome,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/90 dark:bg-[#0f1424]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Hiragana Mastery
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              Active Recall Studio
            </div>
          </div>
        </button>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenFontSelector}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            {fontLabel[currentFont]}
          </button>
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 inline-flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            {settings.soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold">
            <span>Streak {streakCount}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold">
            <span>{todayCount}/{dailyGoal}</span>
          </div>
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md shadow-slate-900/10"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            onClick={onOpenFontSelector}
            title="Choose Font"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
