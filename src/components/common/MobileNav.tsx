import React from 'react';
import { Home, Play, Grid, BarChart2, Edit3 } from 'lucide-react';

type TabId = 'home' | 'practice' | 'chart' | 'dashboard' | 'writing';

interface MobileNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export function MobileNav({ activeTab, onSelectTab }: MobileNavProps) {
  const items: Array<{ id: TabId; label: string; icon: any }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'practice', label: 'Practice', icon: Play },
    { id: 'chart', label: 'Chart', icon: Grid },
    { id: 'dashboard', label: 'Stats', icon: BarChart2 },
    { id: 'writing', label: 'Write', icon: Edit3 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBF9F4]/95 backdrop-blur-lg border-t border-[#E6E0D4] py-2 px-3 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              active
                ? 'bg-[#DCE4D4] text-[#66765B] font-extrabold'
                : 'text-[#6F716C] hover:text-[#30312F]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
