import React, { useState, useEffect, useRef } from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Sparkles, Clock, Zap } from 'lucide-react';
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
  
  // Timer state: 0 = Off, 3 = 3s, 5 = 5s, 10 = 10s, 15 = 15s
  const [timerPreset, setTimerPreset] = useState<number>(0); // Default Off
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  // 3-2-1 Ready Countdown state
  const [readyCount, setReadyCount] = useState<number>(0); // 3, 2, 1, 0 (0 means active)

  const startedAt = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const readyIntervalRef = useRef<any>(null);

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];
  const expectedAnswer = isReverse ? question.character.character : question.character.romanization;

  // Reset input box, timer, and trigger 3-2-1 countdown whenever question or preset changes!
  useEffect(() => {
    setValue('');
    setSubmittedResult(null);

    if (timerPreset > 0) {
      setReadyCount(3);
      setTimeLeft(timerPreset);
    } else {
      setReadyCount(0);
      setTimeLeft(0);
      startedAt.current = Date.now();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [question.id, timerPreset]);

  // 3-2-1 Ready Countdown Interval Ticker
  useEffect(() => {
    if (readyCount <= 0 || timerPreset <= 0) return;

    readyIntervalRef.current = setInterval(() => {
      setReadyCount(prev => {
        if (prev <= 1) {
          clearInterval(readyIntervalRef.current);
          startedAt.current = Date.now();
          setTimeout(() => {
            inputRef.current?.focus();
          }, 50);
          return 0; // Ready countdown finished!
        }
        return prev - 1;
      });
    }, 450); // 450ms per step for punchy 3... 2... 1... countdown

    return () => {
      if (readyIntervalRef.current) clearInterval(readyIntervalRef.current);
    };
  }, [readyCount, timerPreset]);

  // Answer Countdown Ticker (Runs ONLY when readyCount === 0)
  useEffect(() => {
    if (timerPreset <= 0 || readyCount > 0 || submittedResult !== null) {
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
  }, [timerPreset, readyCount, submittedResult, question.id]);

  const handleTimeOut = () => {
    if (submittedResult) return;

    const normalizedTyped = value.trim().toLowerCase();
    const normalizedExpected = expectedAnswer.trim().toLowerCase();
    const isCorrect = normalizedTyped === normalizedExpected;

    setSubmittedResult({
      isCorrect,
      typedAnswer: value.trim(),
      isTimeOut: true
    });

    if (isCorrect) {
      handlePlayAudio();
    }
  };

  // Global Enter Key Listener: If answer is already submitted, pressing Enter anywhere advances to Next!
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (submittedResult) {
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
    if (readyCount > 0) return; // Still in 3-2-1 countdown
    if (submittedResult) return; // Already checked
    if (!value.trim()) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const normalizedTyped = value.trim().toLowerCase();
    const normalizedExpected = expectedAnswer.trim().toLowerCase();
    const isCorrect = normalizedTyped === normalizedExpected;

    setSubmittedResult({
      isCorrect,
      typedAnswer: value.trim()
    });

    if (isCorrect) {
      handlePlayAudio();
    }
  };

  const handleNext = () => {
    if (!submittedResult) return;
    const timeTaken = (Date.now() - startedAt.current) / 1000;
    const isCorrect = submittedResult.isCorrect;
    
    // Clear input before calling onAnswer callback
    setValue('');
    setSubmittedResult(null);
    onAnswer(isCorrect, timeTaken);
  };

  const timerProgressPercent = timerPreset > 0 ? Math.max(0, Math.min(100, (timeLeft / timerPreset) * 100)) : 0;

  return (
    <section className="max-w-xl mx-auto rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn relative">
      
      {/* Top Section Header with Countdown Preset Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pure Recall — Memory Challenge</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Type the answer from memory
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Countdown Preset Controls (Off, 3s, 5s, 10s, 15s) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 px-1.5 text-xs font-bold text-slate-500">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            {[0, 3, 5, 10, 15].map((preset) => (
              <button
                key={preset}
                onClick={() => setTimerPreset(preset)}
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

          <button
            onClick={handlePlayAudio}
            className={`inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-extrabold transition-all ${
              isPlayingAudio
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105 ring-4 ring-amber-500/20'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-900 hover:bg-amber-100'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-white' : 'text-amber-500'}`} />
            <span className="hidden sm:inline">{isPlayingAudio ? 'Playing...' : 'Play'}</span>
          </button>
        </div>
      </div>

      {/* 3-2-1 Ready Countdown Animated Banner */}
      {readyCount > 0 ? (
        <div className="p-3 rounded-2xl bg-amber-500 text-white font-extrabold text-sm text-center animate-bounce flex items-center justify-center gap-2 shadow-lg">
          <Zap className="w-5 h-5 text-amber-200 fill-current animate-pulse" />
          <span>Get Ready! Starting in {readyCount}...</span>
        </div>
      ) : (
        /* Live Countdown Progress Bar (Active when readyCount === 0) */
        timerPreset > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono font-extrabold text-slate-500">
              <span>Countdown Timer</span>
              <span className="text-rose-600 dark:text-rose-400">{timeLeft.toFixed(1)}s</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ${
                  timerProgressPercent > 50 ? 'bg-emerald-500' : timerProgressPercent > 20 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${timerProgressPercent}%` }}
              />
            </div>
          </div>
        )
      )}

      {/* Main Display Prompt Card */}
      <div className="rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] p-8 sm:p-10 text-center relative group">
        <div className={`text-8xl sm:text-9xl font-black text-slate-900 dark:text-white ${displayFontClass}`}>
          {isReverse ? question.character.romanization : question.character.character}
        </div>
        <div className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {isReverse ? 'Type the Hiragana character' : 'Type the sound (romanization)'}
        </div>
      </div>

      {/* Input Field & Action Button */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            ref={inputRef}
            type="text"
            value={value}
            disabled={readyCount > 0}
            readOnly={submittedResult !== null}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (!submittedResult) {
                  handleCheck();
                } else {
                  handleNext();
                }
              }
            }}
            placeholder={readyCount > 0 ? `Get ready... ${readyCount}` : "Type your answer here..."}
            className="flex-1 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] px-5 py-4 text-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-all read-only:opacity-75 disabled:opacity-50"
          />

          {!submittedResult ? (
            <button
              onClick={handleCheck}
              disabled={!value.trim() || readyCount > 0}
              className="rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-extrabold text-base px-8 py-4 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
            >
              {readyCount > 0 ? `${readyCount}...` : 'Check (↵)'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base px-8 py-4 shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Next (↵)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Result Feedback Banner (Displays Incorrect vs Correct Answer Details) */}
      {submittedResult && (
        <div className={`p-5 rounded-2xl border-2 animate-fadeIn transition-all ${
          submittedResult.isCorrect
            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {submittedResult.isCorrect ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-500 shrink-0" />
              )}
              <div>
                <h4 className="text-base font-extrabold">
                  {submittedResult.isCorrect
                    ? 'Correct Answer! 🎉'
                    : submittedResult.isTimeOut
                    ? 'Time Expired! ⌛'
                    : 'Incorrect Answer'}
                </h4>

                {!submittedResult.isCorrect ? (
                  <div className="mt-1.5 space-y-1 text-xs">
                    <div>
                      Your typed answer: <span className="font-mono font-bold line-through text-rose-600 dark:text-rose-400">"{submittedResult.typedAnswer || 'blank'}"</span>
                    </div>
                    <div>
                      Correct answer: <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">"{expectedAnswer}"</span>
                    </div>
                    {question.character.exampleWord && (
                      <div className="text-slate-500 dark:text-slate-400 mt-1">
                        Example: {question.character.exampleWord} ({question.character.exampleMeaning})
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Great recall! Press <b>Enter ↵</b> or click Next to continue.
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handlePlayAudio}
              className="p-2 rounded-xl bg-white dark:bg-[#151c2c] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400"
              title="Listen sound"
            >
              <Volume2 className="w-4 h-4 text-rose-500" />
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
