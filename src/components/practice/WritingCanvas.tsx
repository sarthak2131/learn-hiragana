import React, { useRef, useState, useEffect } from 'react';
import { HiraganaCharacter, FontStyle, Question } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { RotateCcw, Volume2, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface WritingCanvasProps {
  character?: HiraganaCharacter;
  question?: Question;
  activeFont: FontStyle;
  onPlayAudio: (text: string) => void;
  onAnswer?: (isCorrect: boolean, timeTakenSec: number) => void;
  onOpenStrokeGuide?: () => void;
  onFinish?: () => void;
}

export const WritingCanvas: React.FC<WritingCanvasProps> = ({
  character: propChar,
  question,
  activeFont,
  onPlayAudio,
  onAnswer,
  onFinish
}) => {
  const charObj = question ? question.character : propChar;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    clearCanvas();
    startTime.current = Date.now();
    if (charObj) {
      onPlayAudio(charObj.character);
    }
  }, [charObj?.id]);

  if (!charObj) return null;

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setIsVerified(false);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#30312F';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleVerify = () => {
    if (!hasDrawn) return;
    setIsVerified(true);
    onPlayAudio(charObj.character);

    if (onAnswer) {
      const timeTakenSec = (Date.now() - startTime.current) / 1000;
      setTimeout(() => {
        onAnswer(true, timeTakenSec);
      }, 700);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 animate-pageTransition select-none">
      
      {/* Header Info Banner */}
      <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#66765B] px-2.5 py-0.5 rounded-full bg-[#E5EBDD] border border-[#CCD6C2]">
            WRITE IT — HANDWRITING CANVAS
          </span>
          <h3 className="text-base font-extrabold text-[#30312F] mt-2">
            Practice drawing <span className="text-[#66765B]">"{charObj.romanization}"</span> ({charObj.character})
          </h3>
        </div>

        <button
          onClick={() => onPlayAudio(charObj.character)}
          className="p-3 rounded-xl bg-[#E5EBDD] text-[#66765B] hover:bg-[#DCE4D4] transition-all hover:scale-105 shadow-xs"
          title="Play Audio"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Drawing Canvas Paper Card */}
      <div className="bg-[#FFFDF8] border border-[#D8D3C8] p-6 rounded-2xl shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex flex-col items-center space-y-5 relative overflow-hidden">
        
        {/* Toggle Guide & Clear Tools */}
        <div className="w-full flex items-center justify-between text-xs font-bold">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F1E9] text-[#30312F] border border-[#DDD7CB] hover:bg-[#F0EEE6] transition-all"
          >
            {showGuide ? <EyeOff className="w-4 h-4 text-[#66765B]" /> : <Eye className="w-4 h-4 text-[#66765B]" />}
            <span>{showGuide ? 'Hide Template Guide' : 'Show Template Guide'}</span>
          </button>

          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F1E9] text-[#6F716C] border border-[#DDD7CB] hover:text-[#30312F] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Canvas</span>
          </button>
        </div>

        {/* 280x280 Drawing Surface */}
        <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-2xl border-2 border-dashed border-[#DDD7CB] bg-[#FFFDF8] overflow-hidden flex items-center justify-center shadow-inner">
          
          {/* Centered Guide Grid Crosshairs */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-full h-[1px] bg-[#E6E0D4]" />
            <div className="h-full w-[1px] bg-[#E6E0D4] absolute" />
          </div>

          {/* Low-Opacity Template Guide Character */}
          {showGuide && (
            <div className={`absolute inset-0 flex items-center justify-center text-[180px] sm:text-[200px] font-black opacity-[0.14] text-[#8B9B7A] pointer-events-none select-none ${FONT_CLASSES[activeFont]}`}>
              {charObj.character}
            </div>
          )}

          {/* Interactive Canvas */}
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            className="w-full h-full relative z-10 cursor-crosshair"
          />
        </div>

        <div className="text-xs text-[#6F716C]">
          Draw the character stroke by stroke inside the box above.
        </div>
      </div>

      {/* Submit / Verification Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleVerify}
          disabled={!hasDrawn || isVerified}
          className="flex-1 py-3.5 rounded-xl bg-[#8B9B7A] hover:bg-[#66765B] disabled:opacity-40 text-[#FFFDF8] font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isVerified ? 'Stroke Verified ✓' : 'Verify My Handwriting'}</span>
        </button>

        {onFinish && (
          <button
            onClick={onFinish}
            className="px-6 py-3.5 rounded-xl bg-[#FFFDF8] hover:bg-[#F0EEE6] text-[#30312F] font-bold text-sm border border-[#D8D3C8] transition-all flex items-center gap-1.5"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
