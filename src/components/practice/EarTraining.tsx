import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Sparkles, CheckCircle2, XCircle, ArrowRight, Radio } from 'lucide-react';
import { Question, FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';

interface EarTrainingProps {
  question: Question;
  activeFont: FontStyle;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
}

export const EarTraining: React.FC<EarTrainingProps> = ({
  question,
  activeFont,
  onAnswer,
  onPlayAudio
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const startTime = useRef<number>(Date.now());

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];

  // Auto-play audio when question loads
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    startTime.current = Date.now();

    handlePlayAudio();
  }, [question.id]);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    onPlayAudio(question.character.character);
    setTimeout(() => setIsPlayingAudio(false), 1200);
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;

    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === question.correctAnswer || opt === question.character.character;
    if (isCorrect) {
      handlePlayAudio();
    }
  };

  const handleNext = () => {
    const timeTaken = (Date.now() - startTime.current) / 1000;
    const isCorrect = selectedOption === question.correctAnswer || selectedOption === question.character.character;
    onAnswer(isCorrect, timeTaken);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="w-full bg-white dark:bg-[#151c2c] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
            <span>Ear Training — Audio Blind Test</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Listen carefully to spoken audio
          </h3>
        </div>

        <button
          onClick={handlePlayAudio}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition-all ${
            isPlayingAudio
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30 scale-105 ring-4 ring-teal-500/20'
              : 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-900 hover:bg-teal-100'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-white' : 'text-teal-500'}`} />
          <span>{isPlayingAudio ? 'Playing...' : 'Replay Sound'}</span>
        </button>
      </div>

      {/* Main Blind Audio Card (Text is hidden!) */}
      <div className="w-full bg-gradient-to-br from-slate-900 via-[#151c2c] to-teal-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden space-y-4">
        
        {/* Animated Soundwave Visualizer Circle */}
        <button
          onClick={handlePlayAudio}
          className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xl cursor-pointer ${
            isPlayingAudio
              ? 'bg-teal-500 text-white ring-8 ring-teal-500/30 animate-pulse'
              : 'bg-white/10 hover:bg-white/20 text-teal-300 border border-white/20'
          }`}
          title="Tap to listen audio"
        >
          <Volume2 className={`w-14 h-14 sm:w-16 sm:h-16 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
        </button>

        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-300">
            {isAnswered ? 'Spoken Character:' : 'Text Prompt Hidden — Sound Only!'}
          </div>
          {isAnswered && (
            <div className={`text-6xl font-black text-white ${displayFontClass}`}>
              {question.character.character} ({question.character.romanization})
            </div>
          )}
        </div>
      </div>

      {/* 4 Option Tiles */}
      <div className="w-full grid grid-cols-2 gap-3.5">
        {question.options?.map((opt) => {
          let btnStyle = "bg-white dark:bg-[#151c2c] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-teal-500 hover:scale-[1.02]";

          if (isAnswered) {
            if (opt === question.correctAnswer || opt === question.character.character) {
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
              className={`p-5 rounded-2xl border-2 text-3xl font-extrabold flex items-center justify-center transition-all ${displayFontClass} ${btnStyle}`}
            >
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
              {selectedOption === question.correctAnswer || selectedOption === question.character.character ? (
                <>
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Correct Ear Identification! 🎉</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Spoken sound was: <span className="font-bold text-slate-900 dark:text-white">{question.character.character} ({question.character.romanization})</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-7 h-7 text-rose-500 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-rose-600 dark:text-rose-400">Incorrect Identification</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Correct sound was: <span className="font-bold text-slate-900 dark:text-white">{question.character.character} ({question.character.romanization})</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-500/20 transition-all hover:scale-105"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full p-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
            🎧 Listen to the spoken sound and choose the matching character
          </div>
        )}
      </div>

    </div>
  );
};
