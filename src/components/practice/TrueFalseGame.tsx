import React, { useState, useEffect, useRef } from 'react';
import { Question, FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { Check, X, Volume2, Timer } from 'lucide-react';
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
  const [pairPrompt, setPairPrompt] = useState<{ sound: string; isCorrectPair: boolean }>({ sound: '', isCorrectPair: true });
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(2.5);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const shouldBeCorrect = Math.random() > 0.5;
    if (shouldBeCorrect) {
      setPairPrompt({
        sound: question.character.romanization,
        isCorrectPair: true
      });
    } else {
      const distractors = HIRAGANA_DATA.filter(c => c.romanization !== question.character.romanization);
      const randomDistractor = distractors[Math.floor(Math.random() * distractors.length)];
      setPairPrompt({
        sound: randomDistractor ? randomDistractor.romanization : 'ka',
        isCorrectPair: false
      });
    }

    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(2.5);
    startTimeRef.current = Date.now();

    onPlayAudio(question.character.character);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return t - 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question.id]);

  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(null);
    onAnswer(false, 2.5);
  };

  const handleUserChoice = (userSaidTrue: boolean) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setIsAnswered(true);
    setSelectedAnswer(userSaidTrue);
    const timeTakenSec = (Date.now() - startTimeRef.current) / 1000;

    const isUserRight = (userSaidTrue === pairPrompt.isCorrectPair);

    setTimeout(() => {
      onAnswer(isUserRight, timeTakenSec);
    }, 700);
  };

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];
  const timerPercent = Math.max(0, Math.min(100, (timeLeft / 2.5) * 100));

  return (
    <div className="max-w-xl mx-auto space-y-2 py-0 animate-pageTransition select-none">
      
      {/* Top Header Controls */}
      <div className="bg-[#FFFDF8] p-3 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#66765B] px-2 py-0.5 rounded-full bg-[#E5EBDD] border border-[#CCD6C2]">
            RAPID TRUE / FALSE (2.5s)
          </span>
          <h3 className="text-xs font-extrabold text-[#30312F] mt-0.5">
            Tap TRUE (✔️) or FALSE (❌) before timer expires
          </h3>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F4F1E9] border border-[#DDD7CB] text-xs font-black text-[#66765B]">
          <Timer className="w-3.5 h-3.5" />
          <span className="font-mono text-sm">{timeLeft.toFixed(1)}s</span>
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full h-1.5 bg-[#E8E4DA] rounded-full overflow-hidden border border-[#E6E0D4]">
        <div
          className={`h-full transition-all duration-100 ${
            timeLeft < 1.0 ? 'bg-[#D96F61]' : 'bg-[#8B9B7A]'
          }`}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Main Character = Sound Pair Prompt Card */}
      <div className="bg-[#FFFDF8] border border-[#E6E0D4] p-3.5 sm:p-5 rounded-2xl shadow-[0_4px_18px_rgba(48,49,47,0.06)] text-center space-y-1.5 relative overflow-hidden">
        <button
          onClick={() => onPlayAudio(question.character.character)}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-xl bg-[#E5EBDD] text-[#66765B] hover:bg-[#DCE4D4] transition-all"
          title="Play audio"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center justify-center gap-3">
          <span className={`text-4xl sm:text-6xl font-black text-[#30312F] ${displayFontClass}`}>
            {question.character.character}
          </span>
          <span className="text-xl sm:text-3xl font-black text-[#96978F]">=</span>
          <span className="text-2xl sm:text-4xl font-mono font-black text-[#66765B]">
            "{pairPrompt.sound}"
          </span>
        </div>

        <div className="text-[11px] font-semibold text-[#6F716C]">
          Does <span className="font-bold text-[#30312F]">{question.character.character}</span> make sound <span className="font-mono text-[#66765B]">"{pairPrompt.sound}"</span>?
        </div>
      </div>

      {/* Action Buttons: TRUE (Green) vs FALSE (Red) */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* TRUE Button */}
        <button
          disabled={isAnswered}
          onClick={() => handleUserChoice(true)}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            selectedAnswer === true
              ? pairPrompt.isCorrectPair
                ? 'bg-[#E5EBDD] border-[#8B9B7A] text-[#66765B] scale-105 ring-2 ring-[#8B9B7A]/30'
                : 'bg-[#F8E5E0] border-[#D96F61] text-[#D96F61] animate-shake'
              : 'bg-[#E5EBDD] border-[#CCD6C2] text-[#66765B] hover:bg-[#DCE4D4] hover:border-[#8B9B7A] hover:scale-105 shadow-xs'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-[#8B9B7A] text-[#FFFDF8] flex items-center justify-center shadow-xs">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-sm sm:text-lg font-black tracking-wider">TRUE ( ✔️ )</span>
        </button>

        {/* FALSE Button */}
        <button
          disabled={isAnswered}
          onClick={() => handleUserChoice(false)}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            selectedAnswer === false
              ? !pairPrompt.isCorrectPair
                ? 'bg-[#E5EBDD] border-[#8B9B7A] text-[#66765B] scale-105 ring-2 ring-[#8B9B7A]/30'
                : 'bg-[#F8E5E0] border-[#D96F61] text-[#D96F61] animate-shake'
              : 'bg-[#F8E5E0] border-[#F0C9C3] text-[#D96F61] hover:bg-[#F3D5CE] hover:border-[#D96F61] hover:scale-105 shadow-xs'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-[#D96F61] text-[#FFFDF8] flex items-center justify-center shadow-xs">
            <X className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-sm sm:text-lg font-black tracking-wider">FALSE ( ❌ )</span>
        </button>

      </div>

    </div>
  );
};
