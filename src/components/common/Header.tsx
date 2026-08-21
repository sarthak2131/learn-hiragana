import React from 'react';
import { Volume2, VolumeX, Sun, Moon, Settings, Type } from 'lucide-react';
import type { FontStyle, UserSettings } from '../../types';

type TabId = 'home' | 'practice' | 'chart' | 'dashboard' | 'writing';

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
  activeTab?: TabId;
  onSelectTab?: (tab: TabId) => void;
}

const fontLabel: Record<FontStyle, string> = {
  kyokasho: 'Kyōkasho',
  mincho: 'Minchō',
  gothic: 'Gothic',
};

const desktopNavItems: Array<{ id: TabId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'practice', label: 'Practice' },
  { id: 'chart', label: 'Chart' },
  { id: 'dashboard', label: 'Stats' },
  { id: 'writing', label: 'Write' },
];

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
  activeTab = 'home',
  onSelectTab,
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
          className="flex items-center gap-3 text-left group shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border-2 border-rose-500/40 shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform bg-slate-900 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Hiragana Studio Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if logo failed loading
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
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

        {/* Desktop Header Navigation Bar */}
        {onSelectTab && (
          <nav className="hidden md:flex items-center gap-1 ml-4 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {desktopNavItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                    active
                      ? 'bg-rose-600 text-white shadow-sm font-extrabold scale-105'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

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
            <span className="hidden lg:inline">{settings.soundEnabled ? 'Sound On' : 'Sound Off'}</span>
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

