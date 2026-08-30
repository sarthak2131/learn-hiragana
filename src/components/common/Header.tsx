import React from 'react';
import { Volume2, VolumeX, Sun, Settings, Type } from 'lucide-react';
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
    <header className="sticky top-0 z-40 border-b border-[#E6E0D4] bg-[#FBF9F4]/95 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
        
        {/* Brand Logo & Title with Dark Sage Green Circle Badge */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left group shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#66765B] text-[#FFFDF8] flex items-center justify-center font-black text-xl shadow-xs group-hover:scale-105 transition-transform select-none">
            あ
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#66765B]">
              HIRAGANA MASTERY
            </div>
            <div className="text-sm font-black text-[#30312F]">
              Active Recall Studio
            </div>
          </div>
        </button>

        {/* Desktop Navigation Bar with Solid Dark Sage Active State (Reference Image) */}
        {onSelectTab && (
          <nav className="hidden md:flex items-center gap-1 ml-4 bg-[#F4F1E9] p-1.5 rounded-xl border border-[#DDD7CB]">
            {desktopNavItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none ${
                    active
                      ? 'bg-[#66765B] text-[#FFFDF8] shadow-xs font-black'
                      : 'text-[#6F716C] hover:text-[#30312F] hover:bg-[#F0EEE6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        <div className="flex-1" />

        {/* Top-Right Controls */}
        <div className="flex items-center gap-2">
          
          {/* Font Selector Button */}
          <button
            onClick={onOpenFontSelector}
            className="px-3 py-2 rounded-xl border border-[#DDD7CB] bg-[#F7F3EA] text-xs font-bold text-[#4E504B] hover:border-[#8B9B7A] transition-all flex items-center gap-1.5 shadow-xs"
            title="Change Japanese Font Style"
          >
            <Type className="w-3.5 h-3.5 text-[#66765B]" />
            <span className="hidden sm:inline">{fontLabel[currentFont]}</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
              settings.soundEnabled
                ? 'border-[#BFCBB4] bg-[#E5EBDD] text-[#66765B]'
                : 'border-[#DDD7CB] bg-[#F7F3EA] text-[#6F716C]'
            }`}
            title={settings.soundEnabled ? 'Mute Japanese Audio' : 'Enable Japanese Audio'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#66765B] animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#6F716C]" />
            )}
            <span className="hidden lg:inline">{settings.soundEnabled ? 'Sound On' : 'Sound Off'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-[#DDD7CB] bg-[#F7F3EA] text-[#4E504B] hover:border-[#8B9B7A] transition-all shadow-xs"
            title="Toggle Light Mode"
          >
            <Sun className="w-4 h-4 text-[#D9AE58]" />
          </button>

          {/* Streak Indicator with Muted Mustard Accent */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFDF8] text-[#30312F] text-xs font-black border border-[#DDD7CB] shadow-xs">
            <span className="text-[#D9AE58]">🔥</span>
            <span>{streakCount} day</span>
          </div>

          {/* Daily Goal Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFDF8] text-[#E98270] text-xs font-black border border-[#DDD7CB]">
            <span>🎯 {todayCount}/{dailyGoal}</span>
          </div>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-[#F7F3EA] border border-[#DDD7CB] text-[#4E504B] hover:border-[#8B9B7A] transition-all shadow-xs"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
