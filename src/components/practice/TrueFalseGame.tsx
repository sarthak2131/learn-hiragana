import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Question, FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { Check, X, Zap, Volume2 } from 'lucide-react';
import { HIRAGANA_DATA } from '../../data/hiraganaData';

interface TrueFalseGameProps {
  question: Question;
  activeFont: FontStyle;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
}

export const TrueFalseGame: React.FC<TrueFalseGameProps> = ({
  question,
  activeFont,
  onAnswer,
  onPlayAudio
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(2.5);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const startTime = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];

  const pairPrompt = useMemo(() => {
    const isTruePair = Math.random() > 0.5;
    if (isTruePair) {
      return {
        sound: question.character.romanization,
        isCorrectPair: true
      };
    } else {
      const wrongOptionsFromQuestion = (question.options || []).filter(opt => opt !== question.character.romanization);
      let wrongSound = '';
      if (wrongOptionsFromQuestion.length > 0) {
        wrongSound = wrongOptionsFromQuestion[Math.floor(Math.random() * wrongOptionsFromQuestion.length)];
      } else {
        const sameRowChars = HIRAGANA_DATA.filter(c => c.row === question.character.row && c.character !== question.character.character);
        const wrongPool = (sameRowChars.length > 0 ? sameRowChars : HIRAGANA_DATA.filter(c => c.character !== question.character.character)).map(c => c.romanization);
        wrongSound = wrongPool[Math.floor(Math.random() * wrongPool.length)];
      }

      return {
        sound: wrongSound,
        isCorrectPair: false
      };
    }
  }, [question.id, question.options, question.character]);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(2.5);
    startTime.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question.id]);

  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    onPlayAudio(question.character.character);
    setTimeout(() => {
      onAnswer(false, 2.5);
    }, 600);
  };

  const handleUserChoice = (userSaidTrue: boolean) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const timeTakenSec = (Date.now() - startTime.current) / 1000;
    setSelectedAnswer(userSaidTrue);
    setIsAnswered(true);

    const isUserCorrect = userSaidTrue === pairPrompt.isCorrectPair;
    onPlayAudio(question.character.character);

    setTimeout(() => {
      onAnswer(isUserCorrect, timeTakenSec);
    }, 600);
  };

  const timerPercent = Math.max(0, Math.min(100, (timeLeft / 2.5) * 100));

  return (
    <div className="max-w-xl mx-auto space-y-4 py-1 animate-pageTransition select-none">
      
      {/* Top Header Controls */}
      <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-[#66765B] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EBDD] border border-[#CCD6C2]">
            <Zap className="w-3.5 h-3.5 text-[#66765B]" />
            <span>RAPID FIRE TRUE OR FALSE</span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-[#30312F] mt-2">
            Is this character and sound pair matching?
          </h3>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="text-[10px] font-extrabold text-[#6F716C] uppercase">Timer</span>
          <span className="text-xl font-mono font-black text-[#66765B]">
            {timeLeft.toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-2 bg-[#E8E4DA] rounded-full overflow-hidden border border-[#E6E0D4]">
        <div 
          className="h-full bg-[#8B9B7A] rounded-full transition-all duration-100 ease-linear"
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Main Character = Sound Pair Prompt Card */}
      <div className="bg-[#FFFDF8] border border-[#E6E0D4] p-4 sm:p-6 rounded-2xl shadow-[0_4px_18px_rgba(48,49,47,0.06)] text-center space-y-3 relative overflow-hidden">
        <button
          onClick={() => onPlayAudio(question.character.character)}
          className="absolute top-3 right-3 p-2 rounded-xl bg-[#E5EBDD] text-[#66765B] hover:bg-[#DCE4D4] transition-all"
          title="Play audio"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <span className={`text-5xl sm:text-7xl font-black text-[#30312F] ${displayFontClass}`}>
            {question.character.character}
          </span>
          <span className="text-2xl sm:text-4xl font-black text-[#96978F]">=</span>
          <span className="text-3xl sm:text-5xl font-mono font-black text-[#66765B]">
            "{pairPrompt.sound}"
          </span>
        </div>

        <div className="text-xs font-semibold text-[#6F716C]">
          Does <span className="font-bold text-[#30312F]">{question.character.character}</span> make the sound <span className="font-mono text-[#66765B]">"{pairPrompt.sound}"</span>?
        </div>
      </div>

      {/* Action Buttons: TRUE (Green) vs FALSE (Red) */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* TRUE Button */}
        <button
          disabled={isAnswered}
          onClick={() => handleUserChoice(true)}
          className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            selectedAnswer === true
              ? pairPrompt.isCorrectPair
                ? 'bg-[#E5EBDD] border-[#8B9B7A] text-[#66765B] scale-105 ring-4 ring-[#8B9B7A]/30'
                : 'bg-[#F8E5E0] border-[#D96F61] text-[#D96F61] animate-shake'
              : 'bg-[#E5EBDD] border-[#CCD6C2] text-[#66765B] hover:bg-[#DCE4D4] hover:border-[#8B9B7A] hover:scale-105 shadow-xs'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-[#8B9B7A] text-[#FFFDF8] flex items-center justify-center shadow-xs">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <span className="text-base sm:text-xl font-black tracking-wider">TRUE ( ✔️ )</span>
        </button>

        {/* FALSE Button */}
        <button
          disabled={isAnswered}
          onClick={() => handleUserChoice(false)}
          className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            selectedAnswer === false
              ? !pairPrompt.isCorrectPair
                ? 'bg-[#E5EBDD] border-[#8B9B7A] text-[#66765B] scale-105 ring-4 ring-[#8B9B7A]/30'
                : 'bg-[#F8E5E0] border-[#D96F61] text-[#D96F61] animate-shake'
              : 'bg-[#F8E5E0] border-[#F0C9C3] text-[#D96F61] hover:bg-[#F3D5CE] hover:border-[#D96F61] hover:scale-105 shadow-xs'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-[#D96F61] text-[#FFFDF8] flex items-center justify-center shadow-xs">
            <X className="w-5 h-5 stroke-[3]" />
          </div>
          <span className="text-base sm:text-xl font-black tracking-wider">FALSE ( ❌ )</span>
        </button>

      </div>

    </div>
  );
};
