import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trash2, Eye, Check, X, Volume2, Info, Timer, Zap } from 'lucide-react';
import { Question, FontStyle } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { STROKE_DATA_MAP } from '../../data/strokeOrderData';

interface WritingCanvasProps {
  question: Question;
  activeFont: FontStyle;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onPlayAudio: (text: string) => void;
  onOpenStrokeGuide?: () => void;
}

export const WritingCanvas: React.FC<WritingCanvasProps> = ({
  question,
  activeFont,
  onAnswer,
  onPlayAudio,
  onOpenStrokeGuide
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showGuideOverlay, setShowGuideOverlay] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // Countdown timer settings (10s default countdown for writing)
  const [countdownSeconds, setCountdownSeconds] = useState<number>(10);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const timerRef = useRef<any>(null);

  const displayFontClass = question.displayFont ? FONT_CLASSES[question.displayFont] : FONT_CLASSES[activeFont];
  const strokeData = STROKE_DATA_MAP[question.character.character];

  // Canvas Initialization & Countdown Setup
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeHistory([]);
  }, []);

  useEffect(() => {
    setIsRevealed(false);
    setShowGuideOverlay(false);
    setStartTime(Date.now());
    setTimeLeft(countdownSeconds);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#e11d48';
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question.id, countdownSeconds]);

  const handleTimeOut = () => {
    if (!isRevealed) {
      setIsRevealed(true);
      onPlayAudio(question.character.character);
    }
  };

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory(prev => [...prev, imgData]);
  }, []);

  const handleUndo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (strokeHistory.length > 1) {
      const prevStates = [...strokeHistory];
      prevStates.pop();
      const lastState = prevStates[prevStates.length - 1];
      ctx.putImageData(lastState, 0, 0);
      setStrokeHistory(prevStates);
    } else {
      clearCanvas();
    }
  }, [strokeHistory, clearCanvas]);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveState();
    setIsDrawing(true);

    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isRevealed) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleReveal = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRevealed(true);
    onPlayAudio(question.character.character);
  };

  const handleSelfEval = (isGood: boolean) => {
    const timeTaken = (Date.now() - startTime) / 1000;
    onAnswer(isGood, timeTaken);
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / countdownSeconds) * 100));

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full space-y-4">
      
      {/* Top Countdown Bar & Controls */}
      <div className="w-full bg-white dark:bg-[#151c2c] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-rose-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Writing Countdown:</span>
          <span className="text-xs font-mono font-extrabold text-rose-600 dark:text-rose-400">{timeLeft.toFixed(1)}s</span>
        </div>

        {/* Countdown preset buttons */}
        <div className="flex items-center gap-1">
          {[5, 10, 15, 20].map(s => (
            <button
              key={s}
              onClick={() => setCountdownSeconds(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                countdownSeconds === s
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {s}s
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ${
            progressPercent > 40 ? 'bg-emerald-500' : progressPercent > 15 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Target Sound Prompt */}
      <div className="w-full flex items-center justify-between px-6 py-3.5 rounded-2xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Write Hiragana for sound:
          </span>
          <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {question.character.romanization}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPlayAudio(question.character.character)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            title="Listen sound"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowGuideOverlay(prev => !prev)}
            className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
              showGuideOverlay 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle faint reference outline"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawing Canvas Box */}
      <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[380px] bg-slate-50 dark:bg-[#0b0f19] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-xl overflow-hidden touch-none flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
          <div className="w-full h-full border-b border-r border-dashed border-slate-900 dark:border-white top-1/2 left-0 absolute w-full -translate-y-1/2" />
          <div className="w-full h-full border-r border-dashed border-slate-900 dark:border-white left-1/2 top-0 absolute h-full -translate-x-1/2" />
        </div>

        {showGuideOverlay && (
          <div className={`absolute inset-0 flex items-center justify-center text-[180px] sm:text-[220px] font-bold text-slate-300 dark:text-slate-800 opacity-40 pointer-events-none select-none ${displayFontClass}`}>
            {question.character.character}
          </div>
        )}

        {isRevealed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-[#151c2c]/90 backdrop-blur-xs z-20 animate-fadeIn p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              {timeLeft <= 0 ? "Time's Up! Reference:" : 'Correct Character:'}
            </span>
            <div className={`text-9xl font-bold text-slate-900 dark:text-white ${displayFontClass}`}>
              {question.character.character}
            </div>
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-2">
              {strokeData ? `${strokeData.totalStrokes} Strokes` : ''}
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair z-10 touch-none select-none"
          style={{ touchAction: 'none' }}
        />

      </div>

      {/* Action Toolbar */}
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={strokeHistory.length === 0 || isRevealed}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Undo</span>
          </button>

          <button
            onClick={clearCanvas}
            disabled={isRevealed}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>

        {!isRevealed ? (
          <button
            onClick={handleReveal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-500/20 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Reveal</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelfEval(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              <X className="w-4 h-4 text-rose-500" />
              <span>Try again</span>
            </button>

            <button
              onClick={() => handleSelfEval(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Looks good</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
