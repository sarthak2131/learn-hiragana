import { BookOpen, ChartColumn, Home, PencilLine, Trophy } from 'lucide-react';
import type { ComponentType } from 'react';

type TabId = 'home' | 'practice' | 'chart' | 'dashboard' | 'writing';

interface MobileNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

const items: Array<{ id: TabId; label: string; icon: ComponentType<{ className?: string }> }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'practice', label: 'Practice', icon: PencilLine },
  { id: 'chart', label: 'Chart', icon: BookOpen },
  { id: 'dashboard', label: 'Stats', icon: Trophy },
  { id: 'writing', label: 'Write', icon: ChartColumn },
];

export function MobileNav({ activeTab, onSelectTab }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0f1424]/95 backdrop-blur-xl shadow-lg">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 px-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                active
                  ? 'bg-rose-600 text-white font-extrabold shadow-md shadow-rose-500/30 scale-105 dark:bg-rose-600 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
              title={item.label}
            >
              {active && (
                <span className="absolute -top-1 w-6 h-1 bg-rose-600 rounded-full shadow-xs dark:bg-rose-400" />
              )}
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : ''}`} />
              <span className={`text-[10px] ${active ? 'font-black tracking-wide' : 'font-bold'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

