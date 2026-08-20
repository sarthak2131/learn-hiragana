import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, CheckCircle2, ArrowRight, ListOrdered, Radio } from 'lucide-react';
import { FontStyle, HiraganaCharacter } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import confetti from 'canvas-confetti';

interface AudioSequenceMemoryProps {
  activeFont: FontStyle;
  onPlayAudio: (text: string) => void;
  onFinish?: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const AudioSequenceMemory: React.FC<AudioSequenceMemoryProps> = ({
  activeFont,
  onPlayAudio,
}) => {
  const [sequenceLength, setSequenceLength] = useState<number>(5); // 3, 5, 8, 10
  const [targetSequence, setTargetSequence] = useState<HiraganaCharacter[]>([]);
  const [userSequence, setUserSequence] = useState<HiraganaCharacter[]>([]);
  const [isPlayingAudioChain, setIsPlayingAudioChain] = useState<boolean>(false);
  const [activeAudioCharIndex, setActiveAudioCharIndex] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isWrong, setIsWrong] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);

  // Initialize new target sequence
  const initNewSequence = (len: number = sequenceLength) => {
    const randomPicked = shuffle(HIRAGANA_DATA).slice(0, len);
    setTargetSequence(randomPicked);
    setUserSequence([]);
    setIsCompleted(false);
    setIsWrong(false);
  };

  useEffect(() => {
    initNewSequence(sequenceLength);
  }, [sequenceLength, round]);

  // Auto-play audio sequence when target sequence updates
  useEffect(() => {
    if (targetSequence.length > 0 && !isCompleted) {
      playFullAudioSequence(targetSequence);
    }
  }, [targetSequence]);

  const playFullAudioSequence = async (seq: HiraganaCharacter[]) => {
    if (isPlayingAudioChain) return;

    setIsPlayingAudioChain(true);

    for (let i = 0; i < seq.length; i++) {
      setActiveAudioCharIndex(i);
      onPlayAudio(seq[i].character);
      await new Promise((resolve) => setTimeout(resolve, 950));
    }

    setActiveAudioCharIndex(null);
    setIsPlayingAudioChain(false);
  };

  // Tile Selection Handler
  const handleTileClick = (charObj: HiraganaCharacter) => {
    if (isCompleted || isPlayingAudioChain) return;

    onPlayAudio(charObj.character);

    const nextUserSeq = [...userSequence, charObj];
    setUserSequence(nextUserSeq);

    const currentIndex = nextUserSeq.length - 1;

    // Real-time check if current tapped tile matches target sequence at currentIndex
    if (nextUserSeq[currentIndex].character !== targetSequence[currentIndex].character) {
      // WRONG SEQUENCE TILE TAPPED
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
        setUserSequence([]);
      }, 700);
      return;
    }

    // Check if entire sequence completed
    if (nextUserSeq.length === targetSequence.length) {
      setIsCompleted(true);
      setScore(s => s + 1);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleClearUserSeq = () => {
    if (isCompleted || isPlayingAudioChain) return;
    setUserSequence([]);
  };

  // Generate Deck Tiles (Sequence Hiragana + 3 extra distractors)
  const deckTiles = useMemo(() => {
    if (targetSequence.length === 0) return [];
    const seqCharStrs = targetSequence.map(c => c.character);
    const distractorPool = HIRAGANA_DATA.filter(c => !seqCharStrs.includes(c.character));
    const extraDistractors = shuffle(distractorPool).slice(0, 3);
    
    return shuffle([...targetSequence, ...extraDistractors]);
  }, [targetSequence]);

  const activeSpokenChar = activeAudioCharIndex !== null ? targetSequence[activeAudioCharIndex] : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 animate-fadeIn">
      
      {/* Top Controls Header */}
      <div className="bg-white dark:bg-[#151c2c] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <ListOrdered className="w-4 h-4 text-rose-500" />
            <span>Audio Sequence Memory Chain</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Round {round} — Score: {score}
          </h3>
        </div>

        {/* Sequence Length Selector (3, 5, 8, 10) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Length:</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            {[3, 5, 8, 10].map(len => (
              <button
                key={len}
                onClick={() => setSequenceLength(len)}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  sequenceLength === len
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Audio Sequence Visualizer Prompt Card */}
      <div className="bg-gradient-to-br from-slate-900 via-[#151c2c] to-rose-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-5 text-center relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
            {isPlayingAudioChain ? '🔊 Spoken Audio Playing...' : '🎧 Tap Tiles In Spoken Audio Order'}
          </span>

          <button
            onClick={() => playFullAudioSequence(targetSequence)}
            disabled={isPlayingAudioChain}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              isPlayingAudioChain
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudioChain ? 'Playing...' : 'Replay Full Audio Sequence'}</span>
          </button>
        </div>

        {/* Live Audio Spoken Sound Wave Icon + English Romaji (Japanese character is HIDDEN!) */}
        {isPlayingAudioChain && activeSpokenChar ? (
          <div className="py-3 animate-fadeIn flex flex-col items-center justify-center space-y-2">
            
            {/* Sound Wave Circle Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 shadow-xl ring-8 ring-rose-500/10 animate-pulse">
              <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
            </div>

            {/* Real-time English Romaji Transcription */}
            <div className="text-2xl sm:text-3xl font-mono font-black text-amber-300 tracking-wider uppercase">
              "{activeSpokenChar.romanization}"
            </div>
          </div>
        ) : (
          <div className="py-3 text-xs font-semibold text-slate-300">
            {isCompleted ? '🎉 Sequence Complete!' : 'Listen carefully and select matching Hiragana tiles below'}
          </div>
        )}

        {/* Sequence Slots Progress Display */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-2">
          {targetSequence.map((targetChar, idx) => {
            const userPickedChar = userSequence[idx];
            const isCurrentPlayingAudio = activeAudioCharIndex === idx;

            let slotStyle = "bg-white/10 border-white/20 text-white/40";
            let displayChar: React.ReactNode = `${idx + 1}`;
            let displayRomaji = "";

            if (isCurrentPlayingAudio) {
              slotStyle = "bg-rose-500 border-rose-400 text-white ring-4 ring-rose-500/30 scale-110 shadow-xl";
              displayChar = <Volume2 className="w-6 h-6 animate-pulse" />;
              displayRomaji = targetChar.romanization;
            } else if (userPickedChar) {
              slotStyle = isCompleted
                ? "bg-emerald-500 border-emerald-400 text-white shadow-lg"
                : isWrong
                ? "bg-rose-500 border-rose-400 text-white animate-bounce"
                : "bg-indigo-600 border-indigo-500 text-white shadow-md";
              displayChar = userPickedChar.character;
              displayRomaji = userPickedChar.romanization;
            } else if (isCompleted) {
              displayChar = targetChar.character;
              displayRomaji = targetChar.romanization;
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 text-2xl sm:text-3xl font-extrabold flex items-center justify-center transition-all ${FONT_CLASSES[activeFont]} ${slotStyle}`}
                >
                  {displayChar}
                </div>
                
                {/* Real-time English Romaji Transcription Label */}
                <div className="text-[11px] font-mono font-bold text-amber-300 min-h-[16px]">
                  {displayRomaji}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tile Selection Deck with Hiragana + English Romaji */}
      <div className="bg-white dark:bg-[#151c2c] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Tap Characters In Order Spoken:
          </span>

          <button
            onClick={handleClearUserSeq}
            disabled={userSequence.length === 0 || isCompleted}
            className="text-xs font-bold text-slate-500 hover:text-rose-600 disabled:opacity-30"
          >
            Clear Selected
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {deckTiles.map(charObj => {
            return (
              <button
                key={charObj.id}
                onClick={() => handleTileClick(charObj)}
                disabled={isPlayingAudioChain || isCompleted}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all bg-slate-50 dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-rose-500 hover:scale-105 active:scale-95 shadow-sm disabled:opacity-40`}
              >
                <span className={`text-3xl font-extrabold ${FONT_CLASSES[activeFont]}`}>
                  {charObj.character}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-400 mt-0.5">
                  {charObj.romanization}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Celebration Card */}
      {isCompleted && (
        <div className="p-6 rounded-3xl bg-emerald-500 text-white shadow-2xl flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-white shrink-0" />
            <div>
              <div className="text-lg font-black">100% Correct Sequence Recall! 🎉</div>
              <div className="text-xs opacity-90">
                Sequence ({sequenceLength} chars): {targetSequence.map(c => `${c.character} (${c.romanization})`).join(' → ')}
              </div>
            </div>
          </div>

          <button
            onClick={() => setRound(r => r + 1)}
            className="px-6 py-3 rounded-2xl bg-white text-emerald-700 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>Next Round</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
