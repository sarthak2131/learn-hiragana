import React, { useState, useEffect, useRef } from 'react';
import { Question, FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';

interface SoundToCharacterProps {
  question: Question;
  activeFont: FontStyle;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
}

export const SoundToCharacter: React.FC<SoundToCharacterProps> = ({
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
          <span className="text-[10px] font-black uppercase tracking-widest text-[#66765B] px-2.5 py-0.5 rounded-full bg-[#E5EBDD] border border-[#CCD6C2]">
            BUILD IT — SOUND TO CHARACTER
          </span>
          <h3 className="text-base font-extrabold text-[#30312F] mt-2">
            Select the Hiragana for sound <span className="font-mono text-[#66765B]">"{question.character.romanization}"</span>:
          </h3>
        </div>

        <button
          onClick={() => onPlayAudio(question.character.character)}
          className="p-3 rounded-xl bg-[#E5EBDD] text-[#66765B] hover:bg-[#DCE4D4] transition-all hover:scale-105 shadow-xs"
          title="Replay Audio Sound"
        >
          <Volume2 className="w-5 h-5 animate-pulse" />
        </button>
      </div>

      {/* Hero Sound Display Panel */}
      <div className="bg-[#FFFDF8] border border-[#E6E0D4] p-4 sm:p-6 rounded-2xl shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex flex-col items-center justify-center text-center space-y-2">
        <div className="text-5xl sm:text-6xl font-mono font-black text-[#30312F] uppercase tracking-wider">
          "{question.character.romanization}"
        </div>
        <div className="text-xs text-[#6F716C]">
          Listen to the sound and pick the matching Hiragana character below
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
