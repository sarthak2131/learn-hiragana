import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Question, FontStyle, Difficulty } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';

interface SpeedRecallProps {
  question: Question;
  activeFont: FontStyle;
  difficulty: Difficulty;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
}

const DIFFICULTY_TIMEOUTS: Record<Difficulty, number> = {
  relaxed: 10,
  normal: 5,
  fast: 3,
  extreme: 1.5
};

export const SpeedRecall: React.FC<SpeedRecallProps> = ({
  question,
  activeFont,
  difficulty,
  onAnswer,
  onPlayAudio
}) => {
  const [selectedMaxSeconds, setSelectedMaxSeconds] = useState<number>(DIFFICULTY_TIMEOUTS[difficulty]);
  const [timeLeft, setTimeLeft] = useState<number>(selectedMaxSeconds);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const timerRef = useRef<any>(null);

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(selectedMaxSeconds);
    setStartTime(Date.now());

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
  }, [question.id, selectedMaxSeconds]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption('TIMEOUT');
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === question.correctAnswer;
    if (isCorrect) {
      onPlayAudio(question.character.character);
    }
  };

  const handleNext = () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    onAnswer(selectedOption === question.correctAnswer, timeTaken);
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / selectedMaxSeconds) * 100));

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full space-y-5">
      
      {/* Top Countdown Bar & Preset Options */}
      <div className="w-full bg-white dark:bg-[#151c2c] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Speed Countdown:</span>
          <span className="text-xs font-mono font-extrabold text-amber-600 dark:text-amber-400">{timeLeft.toFixed(1)}s</span>
        </div>

        {/* Interactive timer preset selector */}
        <div className="flex items-center gap-1">
          {[1.5, 3, 5, 10].map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedMaxSeconds(sec)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                selectedMaxSeconds === sec
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {sec}s
            </button>
          ))}
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

      {/* Main Prompt Card */}
      <div className="w-full bg-white dark:bg-[#151c2c] rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Select sound before countdown hits 0!
        </span>

        <div className={`text-7xl sm:text-9xl font-bold text-slate-900 dark:text-white py-4 ${displayFontClass}`}>
          {question.character.character}
        </div>
      </div>

      {/* 4 Shuffled Sound Options */}
      <div className="w-full grid grid-cols-2 gap-3.5">
        {question.options?.map((opt, idx) => {
          let btnStyle = "bg-white dark:bg-[#151c2c] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-rose-400 dark:hover:border-rose-600";

          if (isAnswered) {
            if (opt === question.correctAnswer) {
              btnStyle = "bg-emerald-500 text-white border-emerald-500 shadow-lg";
            } else if (opt === selectedOption) {
              btnStyle = "bg-rose-500 text-white border-rose-500 shadow-lg";
            } else {
              btnStyle = "bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800 opacity-50";
            }
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered}
              className={`relative flex items-center justify-center p-4 sm:p-5 rounded-2xl border text-xl sm:text-2xl font-bold transition-all ${btnStyle}`}
            >
              <span className="absolute top-2 left-2.5 text-[10px] font-extrabold opacity-60 px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-slate-700/50">
                {idx + 1}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Result feedback slot container */}
      <div className="w-full min-h-[76px] flex items-center">
        {isAnswered ? (
          <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 shadow-lg animate-fadeIn">
            <div className="flex items-center gap-3">
              {selectedOption === question.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Fast & Correct!</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Response time: <span className="font-bold text-slate-900 dark:text-white">{((Date.now() - startTime) / 1000).toFixed(2)}s</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-7 h-7 text-rose-500 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                      {selectedOption === 'TIMEOUT' ? 'Time Out!' : 'Incorrect'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Correct sound: <span className="font-bold text-slate-900 dark:text-white">{question.correctAnswer}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-500/20 transition-all hover:scale-105"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full p-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
            ⚡ Tap the matching sound option as fast as you can
          </div>
        )}
      </div>

    </div>
  );
};
