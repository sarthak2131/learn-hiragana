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
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 }, colors: ['#8B9B7A', '#66765B', '#DCE4D4'] });
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
      <div className="bg-[#FFFDF8] p-4 sm:p-5 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-200">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#66765B] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EBDD] border border-[#CCD6C2]">
            <ListOrdered className="w-4 h-4 text-[#66765B]" />
            <span>Audio Sequence Memory Chain</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#30312F] mt-1.5">
            Round {round} — Score: {score}
          </h3>
        </div>

        {/* Sequence Length Selector (3, 5, 8, 10) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#6F716C]">Length:</span>
          <div className="flex items-center gap-1 bg-[#F4F1E9] p-1.5 rounded-xl border border-[#DDD7CB]">
            {[3, 5, 8, 10].map(len => (
              <button
                key={len}
                onClick={() => setSequenceLength(len)}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  sequenceLength === len
                    ? 'bg-[#8B9B7A] text-[#FFFDF8] shadow-xs'
                    : 'text-[#6F716C] hover:text-[#30312F]'
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Audio Sequence Visualizer Prompt Card */}
      <div className="bg-[#FFFDF8] text-[#30312F] p-6 sm:p-8 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] space-y-5 text-center relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#66765B]">
            {isPlayingAudioChain ? '🔊 Spoken Audio Playing...' : '🎧 Tap Tiles In Spoken Audio Order'}
          </span>

          <button
            onClick={() => playFullAudioSequence(targetSequence)}
            disabled={isPlayingAudioChain}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              isPlayingAudioChain
                ? 'bg-[#8B9B7A] text-[#FFFDF8] animate-pulse'
                : 'bg-[#F4F1E9] hover:bg-[#F0EEE6] text-[#30312F] border border-[#DDD7CB]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudioChain ? 'Playing...' : 'Replay Full Audio Sequence'}</span>
          </button>
        </div>

        {isPlayingAudioChain && activeSpokenChar ? (
          <div className="py-3 animate-pageTransition flex flex-col items-center justify-center space-y-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E5EBDD] border-2 border-[#8B9B7A] flex items-center justify-center text-[#66765B] shadow-xs animate-pulse">
              <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
            </div>

            <div className="text-2xl sm:text-3xl font-mono font-black text-[#66765B] tracking-wider uppercase">
              "{activeSpokenChar.romanization}"
            </div>
          </div>
        ) : (
          <div className="py-3 text-xs font-semibold text-[#6F716C]">
            {isCompleted ? '🎉 Sequence Complete!' : 'Listen carefully and select matching Hiragana tiles below'}
          </div>
        )}

        {/* Sequence Slots Progress Display */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-2">
          {targetSequence.map((targetChar, idx) => {
            const userPickedChar = userSequence[idx];
            const isCurrentPlayingAudio = activeAudioCharIndex === idx;

            let slotStyle = "bg-[#F4F1E9] border-[#DDD7CB] text-[#96978F]";
            let displayChar: React.ReactNode = `${idx + 1}`;
            let displayRomaji = "";

            if (isCurrentPlayingAudio) {
              slotStyle = "bg-[#8B9B7A] border-[#8B9B7A] text-[#FFFDF8] ring-4 ring-[#8B9B7A]/30 scale-110 shadow-xs";
              displayChar = <Volume2 className="w-6 h-6 animate-pulse" />;
              displayRomaji = targetChar.romanization;
            } else if (userPickedChar) {
              slotStyle = isCompleted
                ? "bg-[#8B9B7A] border-[#8B9B7A] text-[#FFFDF8] shadow-xs"
                : isWrong
                ? "bg-[#F8E5E0] border-[#D96F61] text-[#D96F61] animate-bounce"
                : "bg-[#DCE4D4] border-[#8B9B7A] text-[#66765B] shadow-xs";
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
                
                <div className="text-[11px] font-mono font-bold text-[#66765B] min-h-[16px]">
                  {displayRomaji}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tile Selection Deck */}
      <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] space-y-3 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6F716C]">
            Tap Characters In Order Spoken:
          </span>

          <button
            onClick={handleClearUserSeq}
            disabled={userSequence.length === 0 || isCompleted}
            className="text-xs font-bold text-[#66765B] hover:underline disabled:opacity-30"
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
                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all bg-[#F4F1E9] border-[#DDD7CB] text-[#30312F] hover:border-[#8B9B7A] hover:scale-105 active:scale-95 shadow-xs disabled:opacity-40`}
              >
                <span className={`text-3xl font-bold ${FONT_CLASSES[activeFont]}`}>
                  {charObj.character}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#6F716C] mt-0.5">
                  {charObj.romanization}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Celebration Card */}
      {isCompleted && (
        <div className="p-6 rounded-2xl bg-[#8B9B7A] text-[#FFFDF8] shadow-xs flex items-center justify-between gap-4 animate-pageTransition">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-[#FFFDF8] shrink-0" />
            <div>
              <div className="text-lg font-black">100% Correct Sequence Recall! 🎉</div>
              <div className="text-xs opacity-90">
                Sequence ({sequenceLength} chars): {targetSequence.map(c => `${c.character} (${c.romanization})`).join(' → ')}
              </div>
            </div>
          </div>

          <button
            onClick={() => setRound(r => r + 1)}
            className="px-6 py-3 rounded-xl bg-[#FFFDF8] text-[#66765B] font-bold text-sm shadow-xs hover:bg-[#F0EEE6] transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>Next Round</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
