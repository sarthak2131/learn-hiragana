import React, { useState, useEffect, useRef } from 'react';
import { Question, FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { Layers, Volume2, CheckCircle2, XCircle } from 'lucide-react';

interface SimilarCharacterGameProps {
  question?: Question;
  activeFont?: FontStyle;
  currentFont?: FontStyle;
  selectedRowIds?: string[];
  onChangeFont?: (font: FontStyle) => void;
  onAnswer?: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
  onFinish?: () => void;
}

export const SimilarCharacterGame: React.FC<SimilarCharacterGameProps> = ({
  question,
  activeFont = 'kyokasho',
  currentFont,
  onAnswer,
  onPlayAudio
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const startTime = useRef<number>(Date.now());

  const fontToUse = currentFont || activeFont;
  const displayFontClass = question?.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[fontToUse];

  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    startTime.current = Date.now();
  }, [question?.id]);

  const handleSelect = (option: string) => {
    if (isSubmitted || !question || !onAnswer) return;
    const timeTakenSec = (Date.now() - startTime.current) / 1000;
    setSelectedOption(option);
    setIsSubmitted(true);

    const isCorrect = option === question.correctAnswer;
    onPlayAudio(question.character.character);

    setTimeout(() => {
      onAnswer(isCorrect, timeTakenSec);
    }, 900);
  };

  if (!question) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 animate-pageTransition select-none">
      
      {/* Top Question Header */}
      <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#66765B] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EBDD] border border-[#CCD6C2]">
            <Layers className="w-3.5 h-3.5 text-[#66765B]" />
            <span>SPOT THE DIFFERENCE — SIMILAR LOOKING KANA</span>
          </span>
          <h3 className="text-base font-extrabold text-[#30312F] mt-2">
            Which character is <span className="font-mono text-[#66765B]">"{question.character.romanization}"</span>?
          </h3>
        </div>

        <button
          onClick={() => onPlayAudio(question.character.character)}
          className="p-3 rounded-xl bg-[#E5EBDD] text-[#66765B] hover:bg-[#DCE4D4] transition-all hover:scale-105 shadow-xs"
          title="Play Audio"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Target Prompt Card */}
      <div className="bg-[#FFFDF8] border border-[#E6E0D4] p-6 sm:p-8 rounded-2xl shadow-[0_4px_18px_rgba(48,49,47,0.06)] text-center space-y-2">
        <div className="text-xs font-bold text-[#6F716C] uppercase tracking-wider">
          TARGET ROMAJI SOUND
        </div>
        <div className="text-5xl sm:text-6xl font-mono font-black text-[#66765B]">
          "{question.character.romanization}"
        </div>
        <div className="text-xs text-[#6F716C] pt-2 border-t border-[#E6E0D4] max-w-md mx-auto">
          Look closely at subtle loops, strokes, and diacritics to pick the correct character
        </div>
      </div>

      {/* 2x2 Answer Grid of Similar Looking Kana */}
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
              className={`p-8 rounded-2xl border flex items-center justify-center transition-all duration-200 text-6xl sm:text-7xl font-bold ${displayFontClass} ${btnStyle}`}
            >
              <span>{option}</span>
              {isSubmitted && isCorrect && isSelected && (
                <CheckCircle2 className="w-6 h-6 text-[#66765B] ml-2 animate-scaleIn" />
              )}
              {isSubmitted && !isCorrect && isSelected && (
                <XCircle className="w-6 h-6 text-[#D96F61] ml-2 animate-scaleIn" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};
