import React, { useState, useEffect, useRef } from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
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
  const [submittedResult, setSubmittedResult] = useState<{ isCorrect: boolean; typedAnswer: string } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const startedAt = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement | null>(null);

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];
  const expectedAnswer = isReverse ? question.character.character : question.character.romanization;

  // Automatically reset input box and state whenever question changes!
  useEffect(() => {
    setValue('');
    setSubmittedResult(null);
    startedAt.current = Date.now();

    // Auto focus input field for instant typing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [question.id]);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    onPlayAudio(question.character.character);
    setTimeout(() => setIsPlayingAudio(false), 1200);
  };

  const handleCheck = () => {
    if (submittedResult) return; // Already checked

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

  return (
    <section className="max-w-xl mx-auto rounded-3xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
      
      {/* Top Section Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pure Recall — Memory Challenge</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Type the answer from memory
          </h3>
        </div>

        <button
          onClick={handlePlayAudio}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition-all ${
            isPlayingAudio
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105 ring-4 ring-amber-500/20'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-900 hover:bg-amber-100'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-white' : 'text-amber-500'}`} />
          <span>{isPlayingAudio ? 'Playing...' : 'Play Sound'}</span>
        </button>
      </div>

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
            disabled={submittedResult !== null}
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
            placeholder="Type your answer here..."
            className="flex-1 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] px-5 py-4 text-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-all disabled:opacity-75"
          />

          {!submittedResult ? (
            <button
              onClick={handleCheck}
              disabled={!value.trim()}
              className="rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-extrabold text-base px-8 py-4 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
            >
              Check
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base px-8 py-4 shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Next</span>
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
                  {submittedResult.isCorrect ? 'Correct Answer! 🎉' : 'Incorrect Answer'}
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
                    Great recall! Press Enter or click Next to continue.
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
