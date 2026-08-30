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
    <header className="sticky top-0 z-40 border-b border-[#D9DDF0] dark:border-[#252B40] bg-white/95 dark:bg-[#111522]/95 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
        
        {/* Brand Logo & Title with Indigo Circular Mark */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left group shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#4F46E5] dark:bg-[#6366F1] text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform select-none">
            あ
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4F46E5] dark:text-[#818CF8]">
              HIRAGANA MASTERY
            </div>
            <div className="text-sm font-black text-[#151827] dark:text-[#F8FAFC]">
              Active Recall Studio
            </div>
          </div>
        </button>

        {/* Desktop Navigation Bar with Indigo Active State */}
        {onSelectTab && (
          <nav className="hidden md:flex items-center gap-1 ml-4 bg-[#F4F5FF] dark:bg-[#080A12] p-1.5 rounded-xl border border-[#D9DDF0] dark:border-[#252B40]">
            {desktopNavItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
                    active
                      ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white shadow-sm font-black scale-105'
                      : 'text-[#475069] dark:text-[#A8B0C2] hover:text-[#151827] dark:hover:text-white hover:bg-[#EEF2FF] dark:hover:bg-[rgba(99,102,241,0.10)]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        <div className="flex-1" />

        {/* Controls Header Tools */}
        <div className="flex items-center gap-2">
          
          {/* Font Selector Button */}
          <button
            onClick={onOpenFontSelector}
            className="px-3 py-2 rounded-lg border border-[#D9DDF0] dark:border-[#252B40] bg-white dark:bg-[#111522] text-xs font-bold text-[#151827] dark:text-[#F8FAFC] hover:border-[#4F46E5] dark:hover:border-[#6366F1] transition-all flex items-center gap-1.5 shadow-xs"
            title="Change Japanese Font Style"
          >
            <Type className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#6366F1]" />
            <span className="hidden sm:inline">{fontLabel[currentFont]}</span>
          </button>

          {/* Sound Toggle Button (Indigo Monochromatic) */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
              settings.soundEnabled
                ? 'border-[#4F46E5]/40 dark:border-[#6366F1]/40 bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] text-[#4F46E5] dark:text-[#818CF8]'
                : 'border-[#D9DDF0] dark:border-[#252B40] bg-white dark:bg-[#111522] text-[#69738A] dark:text-[#737D94]'
            }`}
            title={settings.soundEnabled ? 'Mute Japanese Audio' : 'Enable Japanese Audio'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#4F46E5] dark:text-[#6366F1] animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#69738A] dark:text-[#737D94]" />
            )}
            <span className="hidden lg:inline">{settings.soundEnabled ? 'Sound On' : 'Sound Off'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg border border-[#D9DDF0] dark:border-[#252B40] bg-white dark:bg-[#111522] text-[#151827] dark:text-[#F8FAFC] hover:border-[#6366F1] transition-all shadow-xs"
            title="Toggle Light / Dark Mode"
          >
            <Sun className="w-4 h-4 hidden dark:block text-[#818CF8]" />
            <Moon className="w-4 h-4 block dark:hidden text-[#4F46E5]" />
          </button>

          {/* Daily Goal & Streak Badges */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] text-[#4F46E5] dark:text-[#818CF8] text-xs font-black border border-[#4F46E5]/20 dark:border-[#6366F1]/20">
            <span>🔥 {streakCount} day</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] text-[#4F46E5] dark:text-[#818CF8] text-xs font-black border border-[#4F46E5]/20 dark:border-[#6366F1]/20">
            <span>🎯 {todayCount}/{dailyGoal}</span>
          </div>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-lg bg-[#4F46E5] dark:bg-[#6366F1] text-white shadow-sm hover:scale-105 transition-all"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
