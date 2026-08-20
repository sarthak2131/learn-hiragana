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
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0f1424]/95 backdrop-blur-xl">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition-all ${
                active
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
