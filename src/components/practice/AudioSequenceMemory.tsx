import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, CheckCircle2, ArrowRight, ListOrdered } from 'lucide-react';
import { FontStyle, HiraganaCharacter } from '../../types';
import { FONT_CLASSES } from '../../hooks/useFont';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import confetti from 'canvas-confetti';

interface AudioSequenceMemoryProps {
  activeFont: FontStyle;
  selectedRowIds?: string[];
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
  selectedRowIds = [],
  onPlayAudio,
}) => {
  const [sequenceLength, setSequenceLength] = useState<number>(5);
  const [targetSequence, setTargetSequence] = useState<HiraganaCharacter[]>([]);
  const [userSequence, setUserSequence] = useState<HiraganaCharacter[]>([]);
  const [isPlayingAudioChain, setIsPlayingAudioChain] = useState<boolean>(false);
  const [activeAudioCharIndex, setActiveAudioCharIndex] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isWrong, setIsWrong] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);

  const characterPool = useMemo(() => {
    if (!selectedRowIds || selectedRowIds.length === 0) return HIRAGANA_DATA;
    const filtered = HIRAGANA_DATA.filter(c => selectedRowIds.includes(c.row));
    return filtered.length > 0 ? filtered : HIRAGANA_DATA;
  }, [selectedRowIds]);

  const initNewSequence = (len: number = sequenceLength) => {
    const pool = [...characterPool];
    const sequence: HiraganaCharacter[] = [];
    const shuffledPool = shuffle(pool);
    for (let i = 0; i < len; i++) {
      sequence.push(shuffledPool[i % shuffledPool.length]);
    }

    setTargetSequence(sequence);
    setUserSequence([]);
    setIsCompleted(false);
    setIsWrong(false);
  };

  useEffect(() => {
    initNewSequence(sequenceLength);
  }, [sequenceLength, round, characterPool]);

  useEffect(() => {
    if (targetSequence.length > 0 && !isCompleted) {
      playFullAudioSequence(targetSequence);
    }
  }, [targetSequence]);

  const playFullAudioSequence = async (seq: HiraganaCharacter[]) => {
    if (isPlayingAudioChain) return;

    setIsPlayingAudioChain(true);

    try {
      for (let i = 0; i < seq.length; i++) {
        setActiveAudioCharIndex(i);
        onPlayAudio(seq[i].character);

        if (i < seq.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
      }
    } finally {
      setActiveAudioCharIndex(null);
      setIsPlayingAudioChain(false);
    }
  };

  const handleTileClick = (charObj: HiraganaCharacter) => {
    if (isCompleted || isPlayingAudioChain) return;

    onPlayAudio(charObj.character);

    const nextUserSeq = [...userSequence, charObj];
    setUserSequence(nextUserSeq);

    const currentIndex = nextUserSeq.length - 1;

    if (nextUserSeq[currentIndex].character !== targetSequence[currentIndex].character) {
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
        setUserSequence([]);
      }, 700);
      return;
    }

    if (nextUserSeq.length === targetSequence.length) {
      setIsCompleted(true);
      setScore(s => s + 1);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 }, colors: ['#6366F1', '#818CF8', '#4F46E5'] });
    }
  };

  const handleClearUserSeq = () => {
    if (isCompleted || isPlayingAudioChain) return;
    setUserSequence([]);
  };

  const deckTiles = useMemo(() => {
    if (targetSequence.length === 0) return [];
    const seqCharStrs = new Set(targetSequence.map(c => c.character));
    const distractorPool = characterPool.filter(c => !seqCharStrs.has(c.character));
    const distractorsToUse = distractorPool.length > 0 ? distractorPool : characterPool;
    const extraDistractors = shuffle(distractorsToUse).slice(0, 3);
    
    const uniqueDeck: HiraganaCharacter[] = [];
    const seen = new Set<string>();

    for (const c of [...targetSequence, ...extraDistractors]) {
      if (!seen.has(c.character)) {
        seen.add(c.character);
        uniqueDeck.push(c);
      }
    }
    
    return shuffle(uniqueDeck);
  }, [targetSequence, characterPool]);

  const activeSpokenChar = activeAudioCharIndex !== null ? targetSequence[activeAudioCharIndex] : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 animate-pageTransition">
      
      {/* Top Controls Header */}
      <div className="bg-white dark:bg-[#111522] p-4 sm:p-5 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-200">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5] dark:text-[#818CF8] flex items-center gap-1.5">
            <ListOrdered className="w-4 h-4 text-[#4F46E5] dark:text-[#6366F1]" />
            <span>Audio Sequence Memory Chain</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#151827] dark:text-[#F8FAFC] mt-0.5">
            Round {round} — Score: {score}
          </h3>
        </div>

        {/* Sequence Length Selector (3, 5, 8, 10) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#475069] dark:text-[#A8B0C2]">Length:</span>
          <div className="flex items-center gap-1 bg-[#F4F5FF] dark:bg-[#0D1120] p-1.5 rounded-lg border border-[#D9DDF0] dark:border-[#252B40]">
            {[3, 5, 8, 10].map(len => (
              <button
                key={len}
                onClick={() => setSequenceLength(len)}
                className={`px-2.5 py-1 rounded-md text-xs font-extrabold transition-all ${
                  sequenceLength === len
                    ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white shadow-xs'
                    : 'text-[#475069] dark:text-[#A8B0C2] hover:text-[#151827] dark:hover:text-white'
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Audio Sequence Visualizer Prompt Card */}
      <div className="bg-[#111522] text-[#F8FAFC] p-6 sm:p-8 rounded-2xl border border-[#252B40] shadow-md space-y-5 text-center relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#818CF8]">
            {isPlayingAudioChain ? '🔊 Spoken Audio Playing...' : '🎧 Tap Tiles In Spoken Audio Order'}
          </span>

          <button
            onClick={() => playFullAudioSequence(targetSequence)}
            disabled={isPlayingAudioChain}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-2 transition-all ${
              isPlayingAudioChain
                ? 'bg-[#6366F1] text-white animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudioChain ? 'Playing...' : 'Replay Full Audio Sequence'}</span>
          </button>
        </div>

        {isPlayingAudioChain && activeSpokenChar ? (
          <div className="py-3 animate-pageTransition flex flex-col items-center justify-center space-y-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#6366F1]/20 border-2 border-[#6366F1] flex items-center justify-center text-[#818CF8] shadow-xl ring-8 ring-[#6366F1]/10 animate-pulse">
              <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
            </div>

            <div className="text-2xl sm:text-3xl font-mono font-black text-[#818CF8] tracking-wider uppercase">
              "{activeSpokenChar.romanization}"
            </div>
          </div>
        ) : (
          <div className="py-3 text-xs font-semibold text-[#A8B0C2]">
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
              slotStyle = "bg-[#6366F1] border-[#818CF8] text-white ring-4 ring-[#6366F1]/30 scale-110 shadow-xl";
              displayChar = <Volume2 className="w-6 h-6 animate-pulse" />;
              displayRomaji = targetChar.romanization;
            } else if (userPickedChar) {
              slotStyle = isCompleted
                ? "bg-[#6366F1] border-[#818CF8] text-white shadow-md"
                : isWrong
                ? "bg-[#EF4444] border-[#EF4444] text-white animate-bounce"
                : "bg-[#4F46E5] border-[#6366F1] text-white shadow-xs";
              displayChar = userPickedChar.character;
              displayRomaji = userPickedChar.romanization;
            } else if (isCompleted) {
              displayChar = targetChar.character;
              displayRomaji = targetChar.romanization;
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 text-2xl sm:text-3xl font-extrabold flex items-center justify-center transition-all ${FONT_CLASSES[activeFont]} ${slotStyle}`}
                >
                  {displayChar}
                </div>
                
                <div className="text-[11px] font-mono font-bold text-[#818CF8] min-h-[16px]">
                  {displayRomaji}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tile Selection Deck */}
      <div className="bg-white dark:bg-[#111522] p-6 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xs space-y-3 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#475069] dark:text-[#A8B0C2]">
            Tap Characters In Order Spoken:
          </span>

          <button
            onClick={handleClearUserSeq}
            disabled={userSequence.length === 0 || isCompleted}
            className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] hover:underline disabled:opacity-30"
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
                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all bg-[#F4F5FF] dark:bg-[#0D1120] border-[#D9DDF0] dark:border-[#252B40] text-[#151827] dark:text-[#F8FAFC] hover:border-[#4F46E5] dark:hover:border-[#6366F1] hover:scale-105 active:scale-95 shadow-xs disabled:opacity-40`}
              >
                <span className={`text-3xl font-extrabold ${FONT_CLASSES[activeFont]}`}>
                  {charObj.character}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#69738A] dark:text-[#737D94] mt-0.5">
                  {charObj.romanization}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Celebration Card */}
      {isCompleted && (
        <div className="p-6 rounded-2xl bg-[#4F46E5] dark:bg-[#6366F1] text-white shadow-md flex items-center justify-between gap-4 animate-pageTransition">
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
            className="px-6 py-3 rounded-xl bg-white text-[#4F46E5] font-extrabold text-sm shadow-sm hover:bg-slate-100 transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>Next Round</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
