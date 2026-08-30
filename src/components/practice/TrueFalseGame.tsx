import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Zap, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Question, FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
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
  const [timeLeft, setTimeLeft] = useState<number>(2.5); // 2.5s rapid countdown
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
    setIsAnswered(true);
    setSelectedAnswer(null);
  };

  const handleUserChoice = (userChoice: boolean) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(userChoice);
    setIsAnswered(true);

    const isUserCorrect = userChoice === pairPrompt.isCorrectPair;
    if (isUserCorrect) {
      onPlayAudio(question.character.character);
    }
  };

  const handleNext = () => {
    const timeTaken = (Date.now() - startTime.current) / 1000;
    const isUserCorrect = selectedAnswer === pairPrompt.isCorrectPair;
    onAnswer(isUserCorrect, timeTaken);
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / 2.5) * 100));

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full space-y-5 animate-pageTransition">
      
      {/* Top Countdown Header */}
      <div className="w-full bg-white dark:bg-[#111522] p-4 sm:p-5 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xs flex items-center justify-between gap-3 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#4F46E5] dark:text-[#6366F1] fill-current animate-bounce" />
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5] dark:text-[#818CF8]">
              Rapid Fire True or False
            </div>
            <div className="text-xs text-[#475069] dark:text-[#A8B0C2]">
              Is this character and sound pair matching?
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-[#69738A] uppercase tracking-wider block">Timer</span>
          <span className="text-lg font-mono font-black text-[#4F46E5] dark:text-[#818CF8]">{timeLeft.toFixed(1)}s</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-[#F4F5FF] dark:bg-[#0D1120] rounded-full overflow-hidden border border-[#D9DDF0] dark:border-[#252B40]">
        <div
          className="h-full bg-[#4F46E5] dark:bg-[#6366F1] transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Pairing Display Prompt Card */}
      <div className="w-full bg-white dark:bg-[#111522] p-8 sm:p-10 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xs text-center space-y-4 relative overflow-hidden transition-colors duration-200">
        <div className="flex items-center justify-center gap-6">
          <div className={`text-7xl sm:text-8xl font-black text-[#151827] dark:text-[#F8FAFC] ${displayFontClass}`}>
            {question.character.character}
          </div>
          <div className="text-3xl font-black text-[#69738A] dark:text-[#737D94]">=</div>
          <div className="text-5xl sm:text-6xl font-black text-[#4F46E5] dark:text-[#818CF8] font-mono">
            "{pairPrompt.sound}"
          </div>
        </div>

        <div className="text-xs font-bold text-[#475069] dark:text-[#A8B0C2]">
          Does <span className="font-extrabold text-[#151827] dark:text-[#F8FAFC]">{question.character.character}</span> make the sound <span className="font-extrabold text-[#4F46E5] dark:text-[#818CF8]">"{pairPrompt.sound}"</span>?
        </div>
      </div>

      {/* Big TRUE & FALSE Action Buttons */}
      <div className="w-full grid grid-cols-2 gap-4">
        <button
          onClick={() => handleUserChoice(true)}
          disabled={isAnswered}
          className={`p-6 rounded-2xl border font-black text-2xl sm:text-3xl flex flex-col items-center justify-center gap-2 transition-all shadow-xs hover:scale-105 active:scale-95 ${
            isAnswered
              ? pairPrompt.isCorrectPair
                ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white border-[#4F46E5] dark:border-[#6366F1]'
                : selectedAnswer === true
                ? 'bg-[#B42318] dark:bg-[#EF4444] text-white border-[#B42318] dark:border-[#EF4444]'
                : 'opacity-40 border-[#D9DDF0] dark:border-[#252B40]'
              : 'bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] hover:bg-[#4F46E5] dark:hover:bg-[#6366F1] hover:text-white border-[#4F46E5]/30 text-[#4F46E5] dark:text-[#818CF8]'
          }`}
        >
          <CheckCircle2 className="w-8 h-8" />
          <span>TRUE (✔️)</span>
        </button>

        <button
          onClick={() => handleUserChoice(false)}
          disabled={isAnswered}
          className={`p-6 rounded-2xl border font-black text-2xl sm:text-3xl flex flex-col items-center justify-center gap-2 transition-all shadow-xs hover:scale-105 active:scale-95 ${
            isAnswered
              ? !pairPrompt.isCorrectPair
                ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white border-[#4F46E5] dark:border-[#6366F1]'
                : selectedAnswer === false
                ? 'bg-[#B42318] dark:bg-[#EF4444] text-white border-[#B42318] dark:border-[#EF4444]'
                : 'opacity-40 border-[#D9DDF0] dark:border-[#252B40]'
              : 'bg-[#B42318]/10 hover:bg-[#B42318] dark:hover:bg-[#EF4444] hover:text-white border-[#B42318]/30 text-[#B42318] dark:text-[#EF4444]'
          }`}
        >
          <XCircle className="w-8 h-8" />
          <span>FALSE (❌)</span>
        </button>
      </div>

      {/* Answer Result Toast */}
      {isAnswered && (
        <div className="absolute inset-x-3 -bottom-4 sm:-bottom-5 z-30 flex items-center justify-between p-4 rounded-xl bg-white/95 dark:bg-[#111522]/95 border border-[#D9DDF0] dark:border-[#252B40] shadow-xl backdrop-blur-xl animate-pageTransition">
          <div className="flex items-center gap-3">
            {selectedAnswer === pairPrompt.isCorrectPair ? (
              <>
                <CheckCircle2 className="w-7 h-7 text-[#4F46E5] dark:text-[#6366F1] shrink-0" />
                <div>
                  <div className="text-sm font-bold text-[#4F46E5] dark:text-[#818CF8]">Rapid Fire Correct! 🎉</div>
                  <div className="text-xs text-[#475069] dark:text-[#A8B0C2]">
                    {question.character.character} = "{question.character.romanization}"
                  </div>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-7 h-7 text-[#B42318] dark:text-[#EF4444] shrink-0" />
                <div>
                  <div className="text-sm font-bold text-[#B42318] dark:text-[#EF4444]">
                    {selectedAnswer === null ? 'Time Out!' : 'Incorrect Choice'}
                  </div>
                  <div className="text-xs text-[#475069] dark:text-[#A8B0C2]">
                    Correct sound for {question.character.character} is <span className="font-bold text-[#151827] dark:text-[#F8FAFC]">"{question.character.romanization}"</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4F46E5] dark:bg-[#6366F1] hover:bg-[#4338CA] dark:hover:bg-[#818CF8] text-white font-bold text-sm shadow-xs hover:scale-105"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
