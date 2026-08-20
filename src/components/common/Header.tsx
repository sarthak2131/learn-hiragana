import React from 'react';
import { Volume2, VolumeX, Sun, Moon, Settings, Sparkles, Type } from 'lucide-react';
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
  kyokasho: 'Kyōkasho',
  mincho: 'Minchō',
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
  const toggleTheme = () => {
    const isDarkNow = document.documentElement.classList.contains('dark');
    const nextTheme: UserSettings['theme'] = isDarkNow ? 'light' : 'dark';
    onUpdateSettings({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/90 dark:bg-[#0f1424]/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
        
        {/* Brand Logo & Title */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">
              Hiragana Mastery
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              Active Recall Studio
            </div>
          </div>
        </button>

        <div className="flex-1" />

        {/* Controls */}
        <div className="flex items-center gap-2">
          
          {/* Font Selector Button */}
          <button
            onClick={onOpenFontSelector}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-rose-400 dark:hover:border-rose-600 transition-all flex items-center gap-1.5"
          >
            <Type className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">{fontLabel[currentFont]}</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              settings.soundEnabled
                ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400'
            }`}
            title={settings.soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-500 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
            <span className="hidden md:inline">{settings.soundEnabled ? 'Sound On' : 'Sound Off'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-amber-400 transition-all"
            title="Toggle Light / Dark Mode"
          >
            <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
            <Moon className="w-4 h-4 block dark:hidden text-indigo-600" />
          </button>

          {/* Daily Goal & Streak */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-extrabold border border-rose-100 dark:border-rose-900/50">
            <span>🔥 {streakCount}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-extrabold border border-amber-100 dark:border-amber-900/50">
            <span>🎯 {todayCount}/{dailyGoal}</span>
          </div>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md hover:scale-105 transition-all"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
