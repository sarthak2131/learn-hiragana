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
  
  // Consecutive Streak state (Tracks correct answers in a row!)
  const [consecutiveStreak, setConsecutiveStreak] = useState<number>(0);

  // Timer state: 0 = Off, 3 = 3s, 5 = 5s, 10 = 10s, 15 = 15s
  const [timerPreset, setTimerPreset] = useState<number>(0); // Default Off
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const startedAt = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerIntervalRef = useRef<any>(null);

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];
  const expectedAnswer = isReverse ? question.character.character : question.character.romanization;

  // Handle manual selection of timer preset button by user
  const handleSelectTimerPreset = (preset: number) => {
    setTimerPreset(preset);
    setTimeLeft(preset);
    startedAt.current = Date.now();
    inputRef.current?.focus();
  };

  // Reset input box & timer when question changes — Keeps mobile virtual keyboard OPEN!
  useEffect(() => {
    setValue('');
    setSubmittedResult(null);
    setTimeLeft(timerPreset);
    startedAt.current = Date.now();
    inputRef.current?.focus();
  }, [question.id]);

  // Answer Countdown Ticker
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

  // Real-time Instant Typing Matcher: As soon as typed string matches correct answer, auto-advance instantly!
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

      // Auto advance immediately without closing soft mobile keyboard!
      setTimeout(() => {
        advanceNextQuestion(resultObj);
      }, 280);
    }
  };

  // Global Enter Key Listener for Incorrect answer review
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
    setTimeout(() => setIsPlayingAudio(false), 1200);
  };

  const handleCheck = () => {
    if (submittedResult) return; // Already checked
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
    
    // Clear input before calling onAnswer callback while keeping focus
    setValue('');
    setSubmittedResult(null);
    inputRef.current?.focus();
    onAnswer(isCorrect, timeTaken);
  };

  const handleNext = () => {
    advanceNextQuestion();
  };

  const timerProgressPercent = timerPreset > 0 ? Math.max(0, Math.min(100, (timeLeft / timerPreset) * 100)) : 0;
  const countdownDisplay = timerPreset > 0 ? Math.max(0, Math.ceil(timeLeft - 0.5)) : 0;
  
  // Show streak milestone badge ONLY on multiples of 3 (3, 6, 9, 12...)
  const isStreakMilestone = consecutiveStreak > 0 && consecutiveStreak % 3 === 0;

  return (
    <section className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-4 sm:p-6 lg:p-8 shadow-xl space-y-5 sm:space-y-6 animate-fadeIn relative">
      
      {/* Top Section Header with Responsive Controls */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pure Recall — Memory Challenge</span>
            </div>

            {/* Compact Milestone Streak Badge inline in Header (3, 6, 9...) - Never shifts layout! */}
            {isStreakMilestone && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse shadow-xs">
                <Flame className="w-3 h-3 text-amber-200 fill-current" />
                <span>🔥 {consecutiveStreak} Streak!</span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 leading-tight">
            Type the answer from memory
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {/* Countdown Preset Controls (Off, 3s, 5s, 10s, 15s) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 px-1.5 text-xs font-bold text-slate-500 shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            {[0, 3, 5, 10, 15].map((preset) => (
              <button
                key={preset}
                onClick={() => handleSelectTimerPreset(preset)}
                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all ${
                  timerPreset === preset
                    ? 'bg-amber-500 text-white shadow-xs scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {preset === 0 ? 'Off' : `${preset}s`}
              </button>
            ))}
          </div>

          {/* Fixed Width Play Button */}
          <button
            onClick={handlePlayAudio}
            className={`w-full sm:w-auto sm:min-w-[140px] flex items-center justify-center gap-2 rounded-2xl py-2.5 px-4 text-xs font-extrabold transition-all shrink-0 ${
              isPlayingAudio
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 ring-2 ring-amber-500/20'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-900 hover:bg-amber-100'
            }`}
          >
            <Volume2 className={`w-4 h-4 shrink-0 ${isPlayingAudio ? 'animate-pulse text-white' : 'text-amber-500'}`} />
            <span>{isPlayingAudio ? 'Playing...' : 'Play'}</span>
          </button>
        </div>
      </div>

      {/* Timer Status Slot Container — Reserved height to prevent layout shifts */}
      <div className="min-h-[5.5rem] sm:min-h-[5.75rem] w-full flex items-stretch transition-all">
        {timerPreset > 0 ? (
          <div
            className="w-full rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-300/60 shadow-lg shadow-amber-500/20 px-4 py-3 sm:px-5 sm:py-4 flex flex-col justify-center gap-2"
            aria-live="polite"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 text-center sm:text-left">
              <span className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em]">
                <Zap className="w-4 h-4 shrink-0 text-white/95" />
                <span>Get Ready!</span>
              </span>
              <span className="text-sm sm:text-base font-black whitespace-nowrap">
                Starting in {countdownDisplay}...
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-100"
                style={{ width: `${timerProgressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="w-full rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/20 px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
            <span className="flex items-center justify-center sm:justify-start gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Timer: <strong className="text-slate-600 dark:text-slate-300 font-bold">Off</strong> (Self-paced mode)
              </span>
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold text-center sm:text-right">
              Select 3s, 5s, 10s or 15s to enable speed timer
            </span>
          </div>
        )}
      </div>

      {/* Main Display Prompt Card */}
      <div className="rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] p-6 sm:p-8 lg:p-10 text-center relative group">
        <div className={`text-[clamp(4.75rem,18vw,7.75rem)] sm:text-8xl lg:text-9xl font-black text-slate-900 dark:text-white leading-none ${displayFontClass}`}>
          {isReverse ? question.character.romanization : question.character.character}
        </div>
        <div className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {isReverse ? 'Type the Hiragana character' : 'Type the sound (romanization)'}
        </div>
      </div>

      {/* Input Field & Dynamic Color Action Button — Input stays active so mobile virtual keyboard NEVER closes! */}
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
            className="flex-1 min-w-0 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] px-5 py-4 text-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-all"
          />

          {/* Button style changes dynamically based on result (Check vs Correct! vs Next) */}
          {!submittedResult ? (
            <button
              onClick={handleCheck}
              disabled={!value.trim()}
              className="w-full sm:w-auto sm:min-w-[140px] rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-extrabold text-base px-8 py-4 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              Check
            </button>
          ) : submittedResult.isCorrect ? (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto sm:min-w-[140px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base px-8 py-4 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0"
            >
              <span>Correct! 🎉</span>
              <CheckCircle2 className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto sm:min-w-[140px] rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base px-8 py-4 shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0"
            >
              <span>Next (↵)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Popup Overlay Toast — Appears as an overlay popup without changing page/card height! */}
      {submittedResult && (
        <div className="absolute inset-x-3 -bottom-4 sm:-bottom-6 z-30 p-4 sm:p-5 rounded-2xl border-2 shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-[#151c2ce6] border-slate-200 dark:border-slate-700 animate-fadeIn transition-all transform slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {submittedResult.isCorrect ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-500 shrink-0" />
              )}
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {submittedResult.isCorrect
                    ? 'Correct Answer! 🎉'
                    : submittedResult.isTimeOut
                    ? 'Time Expired! ⌛'
                    : 'Incorrect Answer'}
                </h4>

                {!submittedResult.isCorrect ? (
                  <div className="mt-1 space-y-0.5 text-xs text-slate-600 dark:text-slate-300">
                    <div>
                      Typed: <span className="font-mono font-bold line-through text-rose-600 dark:text-rose-400">"{submittedResult.typedAnswer || 'blank'}"</span>
                      {' | '}
                      Correct: <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">"{expectedAnswer}"</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Advancing to next question...
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePlayAudio}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400"
                title="Listen sound"
              >
                <Volume2 className="w-4 h-4 text-rose-500" />
              </button>
              {!submittedResult.isCorrect && (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
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
