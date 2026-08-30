import React, { useState, useEffect, useRef } from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Sparkles, Clock, Zap, Flame } from 'lucide-react';
import type { FontStyle, Question } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';

interface TrueRecallProps {
  question: Question;
  activeFont: FontStyle;
  isReverse?: boolean;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
}

export function TrueRecall({ question, activeFont, isReverse = false, onAnswer, onPlayAudio }: TrueRecallProps) {
  const [value, setValue] = useState<string>('');
  const [submittedResult, setSubmittedResult] = useState<{ isCorrect: boolean; typedAnswer: string; isTimeOut?: boolean } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  
  // Consecutive Streak state
  const [consecutiveStreak, setConsecutiveStreak] = useState<number>(0);

  // Timer state: 0 = Off, 3 = 3s, 5 = 5s, 10 = 10s, 15 = 15s
  const [timerPreset, setTimerPreset] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const startedAt = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerIntervalRef = useRef<any>(null);

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];
  const expectedAnswer = isReverse ? question.character.character : question.character.romanization;

  const handleSelectTimerPreset = (preset: number) => {
    setTimerPreset(preset);
    setTimeLeft(preset);
    startedAt.current = Date.now();
    inputRef.current?.focus();
  };

  useEffect(() => {
    setValue('');
    setSubmittedResult(null);
    setTimeLeft(timerPreset);
    startedAt.current = Date.now();
    inputRef.current?.focus();
  }, [question.id]);

  useEffect(() => {
    if (timerPreset <= 0 || submittedResult !== null) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(timerIntervalRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerPreset, submittedResult, question.id]);

  const handleTimeOut = () => {
    if (submittedResult) return;

    const normalizedTyped = value.trim().toLowerCase();
    const normalizedExpected = expectedAnswer.trim().toLowerCase();
    const isCorrect = normalizedTyped === normalizedExpected;

    const resultObj = {
      isCorrect,
      typedAnswer: value.trim(),
      isTimeOut: true
    };

    setSubmittedResult(resultObj);

    if (isCorrect) {
      setConsecutiveStreak(s => s + 1);
      handlePlayAudio();
      setTimeout(() => {
        advanceNextQuestion(resultObj);
      }, 350);
    } else {
      setConsecutiveStreak(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (submittedResult) return;

    const newVal = e.target.value;
    setValue(newVal);

    const normalizedTyped = newVal.trim().toLowerCase();
    const normalizedExpected = expectedAnswer.trim().toLowerCase();

    if (normalizedTyped.length > 0 && normalizedTyped === normalizedExpected) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      const resultObj = {
        isCorrect: true,
        typedAnswer: newVal.trim()
      };

      setSubmittedResult(resultObj);
      setConsecutiveStreak(s => s + 1);
      handlePlayAudio();

      setTimeout(() => {
        advanceNextQuestion(resultObj);
      }, 280);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (submittedResult && !submittedResult.isCorrect) {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [submittedResult]);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    onPlayAudio(question.character.character);
    setTimeout(() => setIsPlayingAudio(false), 800);
  };

  const handleCheck = () => {
    if (submittedResult) return;
    if (!value.trim()) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const normalizedTyped = value.trim().toLowerCase();
    const normalizedExpected = expectedAnswer.trim().toLowerCase();
    const isCorrect = normalizedTyped === normalizedExpected;

    const resultObj = {
      isCorrect,
      typedAnswer: value.trim()
    };

    setSubmittedResult(resultObj);

    if (isCorrect) {
      setConsecutiveStreak(s => s + 1);
      handlePlayAudio();
      setTimeout(() => {
        advanceNextQuestion(resultObj);
      }, 280);
    } else {
      setConsecutiveStreak(0);
    }
  };

  const advanceNextQuestion = (resObj = submittedResult) => {
    if (!resObj) return;
    const timeTaken = (Date.now() - startedAt.current) / 1000;
    const isCorrect = resObj.isCorrect;
    
    setValue('');
    setSubmittedResult(null);
    inputRef.current?.focus();
    onAnswer(isCorrect, timeTaken);
  };

  const handleNext = () => {
    advanceNextQuestion();
  };

  const timerProgressPercent = timerPreset > 0 ? Math.max(0, Math.min(100, (timeLeft / timerPreset) * 100)) : 0;
  const isStreakMilestone = consecutiveStreak > 0 && consecutiveStreak % 3 === 0;

  return (
    <section className="max-w-4xl mx-auto rounded-2xl bg-white dark:bg-[#111522] border border-[#D9DDF0] dark:border-[#252B40] p-5 sm:p-6 lg:p-8 shadow-xs space-y-5 sm:space-y-6 animate-pageTransition relative transition-colors duration-200">
      
      {/* Top Header Controls */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5] dark:text-[#818CF8] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PURE RECALL — MEMORY CHALLENGE</span>
            </div>

            {isStreakMilestone && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#4F46E5] dark:bg-[#6366F1] text-white text-[10px] font-black uppercase tracking-wider animate-pulse shadow-xs">
                <Flame className="w-3 h-3 fill-current" />
                <span>🔥 {consecutiveStreak} Streak!</span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#151827] dark:text-[#F8FAFC] mt-1 leading-tight">
            Type the answer from memory
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {/* Countdown Preset Controls (Off, 3s, 5s, 10s, 15s) */}
          <div className="flex items-center gap-1 bg-[#F4F5FF] dark:bg-[#0D1120] p-1.5 rounded-lg border border-[#D9DDF0] dark:border-[#252B40] w-full sm:w-auto overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 px-1 text-xs font-bold text-[#475069] dark:text-[#A8B0C2] shrink-0">
              <Clock className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#818CF8]" />
            </div>
            {[0, 3, 5, 10, 15].map((preset) => (
              <button
                key={preset}
                onClick={() => handleSelectTimerPreset(preset)}
                className={`px-2.5 py-1 rounded-md text-xs font-extrabold transition-all ${
                  timerPreset === preset
                    ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white shadow-xs'
                    : 'text-[#475069] dark:text-[#A8B0C2] hover:text-[#151827] dark:hover:text-white'
                }`}
              >
                {preset === 0 ? 'Off' : `${preset}s`}
              </button>
            ))}
          </div>

          {/* Audio Button */}
          <button
            onClick={handlePlayAudio}
            className={`w-full sm:w-auto sm:min-w-[130px] flex items-center justify-center gap-2 rounded-lg py-2 px-3.5 text-xs font-extrabold transition-all shrink-0 ${
              isPlayingAudio
                ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white shadow-xs scale-105'
                : 'bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] text-[#4F46E5] dark:text-[#818CF8] border border-[#4F46E5]/20 dark:border-[#6366F1]/30 hover:bg-[#E8EAFF] dark:hover:bg-[rgba(99,102,241,0.20)]'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isPlayingAudio ? 'animate-pulse text-white' : 'text-[#4F46E5] dark:text-[#6366F1]'}`} />
            <span>{isPlayingAudio ? 'Playing...' : 'Play Audio'}</span>
          </button>
        </div>
      </div>

      {/* Timer Bar Slot Container */}
      <div className="h-9 w-full flex items-center justify-center transition-all">
        {timerPreset > 0 ? (
          <div className="w-full h-full rounded-lg bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.10)] border border-[#4F46E5]/20 dark:border-[#6366F1]/30 px-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-extrabold text-[#151827] dark:text-[#F8FAFC] shrink-0">
              <Zap className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#6366F1] fill-current shrink-0" />
              <span>Timer:</span>
              <span className="text-[#4F46E5] dark:text-[#818CF8] font-black">{timeLeft.toFixed(1)}s</span>
            </div>

            <div className="flex-1 max-w-[220px] h-1.5 bg-[#D9DDF0] dark:bg-[#252B40] rounded-full overflow-hidden shrink-0">
              <div
                className="h-full rounded-full bg-[#4F46E5] dark:bg-[#6366F1] transition-all duration-100"
                style={{ width: `${timerProgressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full rounded-lg border border-dashed border-[#D9DDF0] dark:border-[#252B40] bg-[#F4F5FF] dark:bg-[#0D1120] px-4 flex items-center justify-between text-xs font-medium text-[#475069] dark:text-[#A8B0C2]">
            <span className="flex items-center gap-1.5 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#69738A] shrink-0" />
              <span>Timer: <strong className="text-[#151827] dark:text-[#F8FAFC] font-bold">Off</strong></span>
            </span>
            <span className="text-[10px] text-[#4F46E5] dark:text-[#818CF8] font-semibold hidden sm:inline">Select 3s, 5s, 10s or 15s to enable speed timer</span>
          </div>
        )}
      </div>

      {/* Main Display Prompt Card (72-100px Hero Character) */}
      <div className="rounded-xl border border-[#D9DDF0] dark:border-[#252B40] bg-[#F4F5FF] dark:bg-[#0D1120] p-6 sm:p-8 lg:p-10 text-center relative group">
        <div className={`text-8xl sm:text-9xl font-black text-[#151827] dark:text-[#F8FAFC] leading-none ${displayFontClass}`}>
          {isReverse ? question.character.romanization : question.character.character}
        </div>
        <div className="mt-3 text-xs font-semibold text-[#475069] dark:text-[#A8B0C2]">
          {isReverse ? 'Type the Hiragana character' : 'Type the sound (romanization)'}
        </div>
      </div>

      {/* Input Field & Indigo Action Button */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (!submittedResult) {
                  handleCheck();
                } else if (!submittedResult.isCorrect) {
                  handleNext();
                }
              }
            }}
            placeholder="Type your answer here..."
            className="flex-1 min-w-0 h-[56px] rounded-xl border border-[#D9DDF0] dark:border-[#252B40] bg-white dark:bg-[#0D1120] px-5 text-xl font-bold text-[#151827] dark:text-[#F8FAFC] placeholder:text-[#69738A] dark:placeholder:text-[#737D94] focus:outline-none focus:border-[#4F46E5] dark:focus:border-[#6366F1] focus:ring-2 focus:ring-[#4F46E5]/30 transition-all"
          />

          {!submittedResult ? (
            <button
              onClick={handleCheck}
              disabled={!value.trim()}
              className="w-full sm:w-auto sm:min-w-[140px] h-[56px] rounded-xl bg-[#4F46E5] dark:bg-[#6366F1] hover:bg-[#4338CA] dark:hover:bg-[#818CF8] disabled:opacity-40 text-white font-extrabold text-base px-8 shadow-xs transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              Check
            </button>
          ) : submittedResult.isCorrect ? (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto sm:min-w-[140px] h-[56px] rounded-xl bg-[#4F46E5] dark:bg-[#6366F1] text-white font-extrabold text-base px-8 shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Correct! 🎉</span>
              <CheckCircle2 className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto sm:min-w-[140px] h-[56px] rounded-xl bg-[#B42318] dark:bg-[#EF4444] text-white font-extrabold text-base px-8 shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Next (↵)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Popup Overlay Toast */}
      {submittedResult && (
        <div className="absolute inset-x-3 -bottom-4 sm:-bottom-6 z-30 p-4 rounded-xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xl bg-white/95 dark:bg-[#111522]/95 backdrop-blur-xl animate-pageTransition">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {submittedResult.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-[#4F46E5] dark:text-[#6366F1] shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-[#B42318] dark:text-[#EF4444] shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-extrabold text-[#151827] dark:text-[#F8FAFC]">
                  {submittedResult.isCorrect
                    ? 'Correct Answer! 🎉'
                    : submittedResult.isTimeOut
                    ? 'Time Expired! ⌛'
                    : 'Not quite'}
                </h4>

                {!submittedResult.isCorrect ? (
                  <div className="mt-0.5 text-xs text-[#475069] dark:text-[#A8B0C2]">
                    Typed: <span className="font-mono font-bold line-through text-[#B42318] dark:text-[#EF4444]">"{submittedResult.typedAnswer || 'blank'}"</span>
                    {' | '}
                    Correct answer: <span className="font-extrabold text-[#4F46E5] dark:text-[#818CF8]">"{expectedAnswer}"</span>
                  </div>
                ) : (
                  <div className="text-xs text-[#475069] dark:text-[#A8B0C2] mt-0.5">
                    Advancing to next question...
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePlayAudio}
                className="p-2 rounded-lg bg-[#F4F5FF] dark:bg-[#0D1120] text-[#4F46E5] dark:text-[#818CF8]"
                title="Listen sound"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              {!submittedResult.isCorrect && (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg bg-[#B42318] dark:bg-[#EF4444] text-white font-extrabold text-xs shadow-xs hover:scale-105 active:scale-95 transition-all"
                >
                  Next (↵)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
