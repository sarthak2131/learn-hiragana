import React, { useState, useEffect, useRef } from 'react';
import { Question, FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { Volume2, CheckCircle2, XCircle, ArrowRight, CornerDownLeft } from 'lucide-react';

interface TrueRecallProps {
  question: Question;
  activeFont: FontStyle;
  isReverse?: boolean;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
}

export const TrueRecall: React.FC<TrueRecallProps> = ({
  question,
  activeFont,
  isReverse = false,
  onAnswer,
  onPlayAudio
}) => {
  const [userTypedInput, setUserTypedInput] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const startTime = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];

  useEffect(() => {
    setUserTypedInput('');
    setIsSubmitted(false);
    setIsCorrect(null);
    startTime.current = Date.now();

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [question.id]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitted || !userTypedInput.trim()) return;

    const timeTakenSec = (Date.now() - startTime.current) / 1000;
    const cleanInput = userTypedInput.trim().toLowerCase();
    const targetAns = isReverse 
      ? question.character.character 
      : question.character.romanization.toLowerCase();

    const correct = cleanInput === targetAns;
    setIsCorrect(correct);
    setIsSubmitted(true);

    onPlayAudio(question.character.character);

    setTimeout(() => {
      onAnswer(correct, timeTakenSec);
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 py-1 animate-pageTransition">
      
      {/* Top Controls Header */}
      <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#66765B] px-2.5 py-0.5 rounded-full bg-[#E5EBDD] border border-[#CCD6C2]">
            PURE RECALL — TYPE ROMAJI
          </span>
          <h3 className="text-base font-extrabold text-[#30312F] mt-2">
            Type the exact romaji sound for this character:
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

      {/* Hero Hiragana Display Panel */}
      <div className="bg-[#FFFDF8] border border-[#E6E0D4] p-4 sm:p-6 rounded-2xl shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex flex-col items-center justify-center text-center space-y-2">
        <div className={`text-6xl sm:text-7xl font-black text-[#30312F] ${displayFontClass}`}>
          {question.character.character}
        </div>
        <div className="text-xs text-[#6F716C]">
          Pure active recall without multiple choice options
        </div>
      </div>

      {/* Type Answer Form Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            disabled={isSubmitted}
            value={userTypedInput}
            onChange={(e) => setUserTypedInput(e.target.value)}
            placeholder="Type sound (e.g. ka, shi, ts)..."
            className="w-full px-5 py-4 text-xl sm:text-2xl font-mono font-bold rounded-2xl border border-[#DDD7CB] bg-[#FFFDF8] text-[#30312F] placeholder-[#96978F] focus:outline-none focus:ring-2 focus:ring-[#8B9B7A] focus:border-[#8B9B7A] shadow-xs"
          />

          <button
            type="submit"
            disabled={isSubmitted || !userTypedInput.trim()}
            className="absolute right-2 px-5 py-2.5 rounded-xl bg-[#8B9B7A] hover:bg-[#66765B] disabled:opacity-40 text-[#FFFDF8] font-bold text-sm shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Submit</span>
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Toast Feedback */}
      {isSubmitted && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between animate-pageTransition ${
          isCorrect 
            ? 'bg-[#E5EBDD] border-[#8B9B7A] text-[#66765B]' 
            : 'bg-[#F8E5E0] border-[#D96F61] text-[#D96F61]'
        }`}>
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 shrink-0" />
            )}
            <div>
              <div className="font-extrabold text-sm">
                {isCorrect ? '100% Correct Recall!' : 'Incorrect Recall'}
              </div>
              <div className="text-xs opacity-90">
                Correct Sound: <span className="font-mono font-bold text-base">"{question.character.romanization}"</span>
              </div>
            </div>
          </div>

          <div className="text-xs font-bold flex items-center gap-1">
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}

    </div>
  );
};
