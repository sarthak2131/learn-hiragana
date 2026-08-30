import React from 'react';
import { Trophy, RotateCcw, Home, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';

interface SessionResultsProps {
  score?: number;
  totalQuestions?: number;
  accuracy?: number;
  stats?: {
    totalQuestions: number;
    correctAnswers: number;
    accuracyPercentage: number;
    incorrectCharacters?: Array<{ character: string; romanization: string }>;
  };
  activeFont: FontStyle;
  onRestart?: () => void;
  onGoHome: () => void;
  onPracticeMistakes?: () => void;
  onTryAgain?: () => void;
  onChangeSetup?: () => void;
  onPlayAudio?: (text: string) => void;
}

export const SessionResults: React.FC<SessionResultsProps> = ({
  score: propScore,
  totalQuestions: propTotalQuestions,
  accuracy: propAccuracy,
  stats,
  activeFont,
  onRestart,
  onGoHome,
  onPracticeMistakes,
  onTryAgain,
  onChangeSetup,
}) => {
  const total = stats ? stats.totalQuestions : (propTotalQuestions || 10);
  const correct = stats ? stats.correctAnswers : (propScore || 0);
  const acc = stats ? stats.accuracyPercentage : (propAccuracy || Math.round((correct / total) * 100));

  const isPerfect = acc === 100;
  const isGreat = acc >= 80;

  const handleRetry = onRestart || onTryAgain || onChangeSetup || onGoHome;

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6 animate-pageTransition">
      
      <div className="bg-[#FFFDF8] text-[#30312F] p-8 sm:p-10 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] text-center space-y-6 transition-colors duration-200">
        
        {/* Trophy / Sparkle Badge */}
        <div className="w-20 h-20 mx-auto rounded-full bg-[#E5EBDD] border-2 border-[#8B9B7A] flex items-center justify-center text-[#66765B] shadow-xs">
          {isPerfect ? (
            <Sparkles className="w-10 h-10 animate-bounce text-[#D9AE58]" />
          ) : (
            <Trophy className="w-10 h-10 text-[#66765B]" />
          )}
        </div>

        <div>
          <span className="px-3.5 py-1 rounded-full bg-[#E5EBDD] text-[#66765B] text-xs font-extrabold uppercase tracking-widest border border-[#CCD6C2]">
            {isPerfect ? '🎉 PERFECT SESSION!' : isGreat ? '🌟 GREAT JOB!' : '💪 SESSION COMPLETED'}
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-[#30312F] mt-3">
            {acc}% Accuracy
          </h2>

          <p className="text-xs text-[#6F716C] mt-2">
            You answered <span className="text-[#30312F] font-extrabold">{correct}</span> out of <span className="text-[#30312F] font-extrabold">{total}</span> questions correctly.
          </p>
        </div>

        {/* Breakdown Stats Grid */}
        <div className="grid grid-cols-2 gap-3 bg-[#F4F1E9] p-4 rounded-xl border border-[#DDD7CB]">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FFFDF8] border border-[#DDD7CB]">
            <CheckCircle2 className="w-6 h-6 text-[#66765B] shrink-0" />
            <div className="text-left">
              <div className="text-[10px] font-bold text-[#6F716C] uppercase">Correct</div>
              <div className="text-xl font-black text-[#66765B]">{correct}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FFFDF8] border border-[#DDD7CB]">
            <XCircle className="w-6 h-6 text-[#D96F61] shrink-0" />
            <div className="text-left">
              <div className="text-[10px] font-bold text-[#6F716C] uppercase">Incorrect</div>
              <div className="text-xl font-black text-[#D96F61]">{total - correct}</div>
            </div>
          </div>
        </div>

        {/* Actions CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onPracticeMistakes && stats?.incorrectCharacters && stats.incorrectCharacters.length > 0 && (
            <button
              onClick={onPracticeMistakes}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#E5EBDD] border border-[#CCD6C2] text-[#66765B] font-bold text-xs shadow-xs hover:bg-[#DCE4D4] transition-all hover:scale-105"
            >
              Review Weak ({stats.incorrectCharacters.length})
            </button>
          )}

          <button
            onClick={handleRetry}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#8B9B7A] hover:bg-[#66765B] text-[#FFFDF8] font-bold text-xs shadow-xs hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>

          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FFFDF8] hover:bg-[#F0EEE6] text-[#30312F] font-bold text-xs border border-[#D8D3C8] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Studio</span>
          </button>
        </div>

      </div>

    </div>
  );
};
