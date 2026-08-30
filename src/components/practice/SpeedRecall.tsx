import React, { useState, useEffect, useRef } from 'react';
import { Question, FontStyle, Difficulty } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { Zap, Volume2, CheckCircle2, XCircle } from 'lucide-react';

interface SpeedRecallProps {
  question: Question;
  activeFont: FontStyle;
  difficulty?: Difficulty;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
}

export const SpeedRecall: React.FC<SpeedRecallProps> = ({
  question,
  activeFont,
  onAnswer,
  onPlayAudio
}) => {
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const baseSeconds = 4.0;
  const targetSeconds = baseSeconds / speedMultiplier;

  const [timeLeft, setTimeLeft] = useState<number>(targetSeconds);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const startTime = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];

  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    const newTargetSec = baseSeconds / speedMultiplier;
    setTimeLeft(newTargetSec);
    startTime.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current);
          handleTimeOut(newTargetSec);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question.id, speedMultiplier]);

  const handleTimeOut = (totalSec: number) => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    onPlayAudio(question.character.character);
    setTimeout(() => {
      onAnswer(false, totalSec);
    }, 600);
  };

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const timeTakenSec = (Date.now() - startTime.current) / 1000;
    setSelectedOption(option);
    setIsSubmitted(true);

    const isCorrect = option === question.correctAnswer;
    onPlayAudio(question.character.character);

    setTimeout(() => {
      onAnswer(isCorrect, timeTakenSec);
    }, 600);
  };

  const timerPercent = Math.max(0, Math.min(100, (timeLeft / targetSeconds) * 100));

  return (
    <div className="max-w-xl mx-auto space-y-4 py-1 animate-pageTransition select-none">
      
      {/* Top Controls Header */}
      <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-[#66765B] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EBDD] border border-[#CCD6C2]">
            <Zap className="w-3.5 h-3.5 text-[#66765B]" />
            <span>SPEED RECALL — {speedMultiplier}x MULTIPLIER</span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-[#30312F] mt-2">
            Select sound before timer expires ({targetSeconds.toFixed(1)}s limit):
          </h3>
        </div>

        {/* Speed Selector Segmented Control */}
        <div className="flex items-center gap-1 bg-[#F4F1E9] p-1.5 rounded-xl border border-[#DDD7CB] shrink-0">
          {[1.0, 1.5, 2.0, 3.0].map(mult => (
            <button
              key={mult}
              onClick={() => setSpeedMultiplier(mult)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                speedMultiplier === mult
                  ? 'bg-[#8B9B7A] text-[#FFFDF8] shadow-xs'
                  : 'text-[#6F716C] hover:text-[#30312F]'
              }`}
            >
              {mult}x
            </button>
          ))}
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-2 bg-[#E8E4DA] rounded-full overflow-hidden border border-[#E6E0D4]">
        <div 
          className="h-full bg-[#8B9B7A] rounded-full transition-all duration-100 ease-linear"
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Hero Character Display Panel */}
      <div className="bg-[#FFFDF8] border border-[#E6E0D4] p-4 sm:p-6 rounded-2xl shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex flex-col items-center justify-center text-center space-y-2 relative">
        <button
          onClick={() => onPlayAudio(question.character.character)}
          className="absolute top-3 right-3 p-2 rounded-xl bg-[#E5EBDD] text-[#66765B] hover:bg-[#DCE4D4] transition-all"
          title="Play audio"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        <div className={`text-6xl sm:text-7xl font-black text-[#30312F] ${displayFontClass}`}>
          {question.character.character}
        </div>

        <div className="text-xs text-[#6F716C]">
          Timer: <span className="font-mono font-bold text-[#66765B] text-base">{timeLeft.toFixed(1)}s</span> remaining
        </div>
      </div>

      {/* 2x2 Answer Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {question.options.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === question.correctAnswer;

          let btnStyle = "bg-[#FFFDF8] border-[#E6E0D4] text-[#30312F] hover:border-[#B7C4AA] hover:bg-[#FEFCF7] hover:scale-[1.02] shadow-xs";

          if (isSubmitted) {
            if (isCorrect) {
              btnStyle = "bg-[#E5EBDD] border-2 border-[#8B9B7A] text-[#66765B] scale-105 ring-2 ring-[#8B9B7A]/30";
            } else if (isSelected && !isCorrect) {
              btnStyle = "bg-[#F8E5E0] border-2 border-[#D96F61] text-[#D96F61] animate-shake";
            } else {
              btnStyle = "bg-[#FFFDF8] border-[#E6E0D4] text-[#96978F] opacity-50";
            }
          }

          return (
            <button
              key={option}
              disabled={isSubmitted}
              onClick={() => handleSelect(option)}
              className={`p-5 rounded-2xl border flex items-center justify-center transition-all duration-200 text-xl font-bold font-mono tracking-wider ${btnStyle}`}
            >
              <span>"{option}"</span>
              {isSubmitted && isCorrect && isSelected && (
                <CheckCircle2 className="w-5 h-5 text-[#66765B] ml-2 animate-scaleIn" />
              )}
              {isSubmitted && !isCorrect && isSelected && (
                <XCircle className="w-5 h-5 text-[#D96F61] ml-2 animate-scaleIn" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};
