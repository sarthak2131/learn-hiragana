import { Sparkles } from 'lucide-react';

interface LearningTipProps {
  tipText: string;
}

export function LearningTip({ tipText }: LearningTipProps) {
  return (
    <div className="rounded-2xl border border-amber-200/70 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 px-4 py-3 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4" />
      </div>
      <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">{tipText}</p>
    </div>
  );
}
