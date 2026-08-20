import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Zap, CheckCircle2, XCircle, ArrowRight, Volume2, ShieldCheck } from 'lucide-react';
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
  const [timeLeft, setTimeLeft] = useState<number>(2.5); // 2.5s rapid countdown per question
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const startTime = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];

  // Randomly generate pairing prompt: 50% chance TRUE pair, 50% chance FALSE pair!
  const pairPrompt = useMemo(() => {
    const isTruePair = Math.random() > 0.5;
    if (isTruePair) {
      return {
        sound: question.character.romanization,
        isCorrectPair: true
      };
    } else {
      const wrongPool = HIRAGANA_DATA
        .filter(c => c.character !== question.character.character)
        .map(c => c.romanization);
      const wrongSound = wrongPool[Math.floor(Math.random() * wrongPool.length)];
      return {
        sound: wrongSound,
        isCorrectPair: false
      };
    }
  }, [question.id]);

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
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full space-y-5 animate-fadeIn">
      
      {/* Top Countdown Header */}
      <div className="w-full bg-white dark:bg-[#151c2c] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Rapid Fire True or False
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Is this character and sound pair matching?
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 block">Timer</span>
          <span className="text-lg font-mono font-black text-rose-600 dark:text-rose-400">{timeLeft.toFixed(1)}s</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ${
            progressPercent > 50 ? 'bg-emerald-500' : progressPercent > 20 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Pairing Display Prompt Card */}
      <div className="w-full bg-white dark:bg-[#151c2c] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-center gap-6">
          <div className={`text-7xl sm:text-8xl font-black text-slate-900 dark:text-white ${displayFontClass}`}>
            {question.character.character}
          </div>
          <div className="text-3xl font-black text-slate-300 dark:text-slate-700">=</div>
          <div className="text-5xl sm:text-6xl font-black text-rose-600 dark:text-rose-400 font-mono">
            "{pairPrompt.sound}"
          </div>
        </div>

        <div className="text-xs font-bold text-slate-400">
          Does <span className="font-extrabold text-slate-900 dark:text-white">{question.character.character}</span> make the sound <span className="font-extrabold text-rose-600 dark:text-rose-400">"{pairPrompt.sound}"</span>?
        </div>
      </div>

      {/* Big TRUE & FALSE Action Buttons */}
      <div className="w-full grid grid-cols-2 gap-4">
        <button
          onClick={() => handleUserChoice(true)}
          disabled={isAnswered}
          className={`p-6 rounded-3xl border-2 font-black text-2xl sm:text-3xl flex flex-col items-center justify-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 ${
            isAnswered
              ? pairPrompt.isCorrectPair
                ? 'bg-emerald-500 text-white border-emerald-500'
                : selectedAnswer === true
                ? 'bg-rose-500 text-white border-rose-500'
                : 'opacity-40 border-slate-200 dark:border-slate-800'
              : 'bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border-emerald-500 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          <CheckCircle2 className="w-8 h-8" />
          <span>TRUE (✔️)</span>
        </button>

        <button
          onClick={() => handleUserChoice(false)}
          disabled={isAnswered}
          className={`p-6 rounded-3xl border-2 font-black text-2xl sm:text-3xl flex flex-col items-center justify-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 ${
            isAnswered
              ? !pairPrompt.isCorrectPair
                ? 'bg-emerald-500 text-white border-emerald-500'
                : selectedAnswer === false
                ? 'bg-rose-500 text-white border-rose-500'
                : 'opacity-40 border-slate-200 dark:border-slate-800'
              : 'bg-rose-500/10 hover:bg-rose-500 hover:text-white border-rose-500 text-rose-600 dark:text-rose-400'
          }`}
        >
          <XCircle className="w-8 h-8" />
          <span>FALSE (❌)</span>
        </button>
      </div>

      {/* Answer Result Feedback Banner */}
      {isAnswered && (
        <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            {selectedAnswer === pairPrompt.isCorrectPair ? (
              <>
                <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Rapid Fire Correct! 🎉</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {question.character.character} = "{question.character.romanization}"
                  </div>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-7 h-7 text-rose-500 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    {selectedAnswer === null ? 'Time Out!' : 'Incorrect Choice'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Correct sound for {question.character.character} is <span className="font-bold text-slate-900 dark:text-white">"{question.character.romanization}"</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-105"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
