import React, { useState, useEffect, useRef } from 'react';
import { Question, FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { Volume2, Radio, CheckCircle2, XCircle } from 'lucide-react';

interface EarTrainingProps {
  question: Question;
  activeFont: FontStyle;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
}

export const EarTraining: React.FC<EarTrainingProps> = ({
  question,
  activeFont,
  onAnswer,
  onPlayAudio
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    startTime.current = Date.now();
    onPlayAudio(question.character.character);
  }, [question.id]);

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    const timeTakenSec = (Date.now() - startTime.current) / 1000;
    setSelectedOption(option);
    setIsSubmitted(true);

    const isCorrect = option === question.correctAnswer;

    onPlayAudio(question.character.character);

    setTimeout(() => {
      onAnswer(isCorrect, timeTakenSec);
    }, 900);
  };

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];

  return (
    <div className="max-w-xl mx-auto space-y-4 py-1 animate-pageTransition">
      
      {/* Top Question Header */}
      <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#66765B] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EBDD] border border-[#CCD6C2]">
            <Radio className="w-3.5 h-3.5 text-[#66765B]" />
            <span>EAR TRAINING — AUDIO BLIND TEST</span>
          </span>
          <h3 className="text-base font-extrabold text-[#30312F] mt-2">
            Listen to the spoken audio and pick the Hiragana:
          </h3>
        </div>
      </div>

      {/* Hero Audio Player Button Panel */}
      <div className="bg-[#FFFDF8] border border-[#E6E0D4] p-8 sm:p-12 rounded-2xl shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex flex-col items-center justify-center text-center space-y-5">
        <button
          onClick={() => onPlayAudio(question.character.character)}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#E5EBDD] border-2 border-[#8B9B7A] text-[#66765B] hover:bg-[#DCE4D4] hover:scale-105 active:scale-95 transition-all shadow-xs flex items-center justify-center"
          title="Replay Spoken Sound"
        >
          <Volume2 className="w-14 h-14 animate-pulse" />
        </button>

        <div className="text-xs font-semibold text-[#6F716C]">
          Tap the big speaker button above to replay the Japanese audio
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
              className={`p-6 rounded-2xl border flex items-center justify-center transition-all duration-200 text-4xl sm:text-5xl font-bold ${displayFontClass} ${btnStyle}`}
            >
              <span>{option}</span>
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
