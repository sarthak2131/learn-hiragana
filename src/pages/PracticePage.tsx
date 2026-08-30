import React from 'react';
import { PracticeSetup } from '../components/practice/PracticeSetup';
import { CharacterToSound } from '../components/practice/CharacterToSound';
import { SoundToCharacter } from '../components/practice/SoundToCharacter';
import { TrueRecall } from '../components/practice/TrueRecall';
import { WritingCanvas } from '../components/practice/WritingCanvas';
import { SpeedRecall } from '../components/practice/SpeedRecall';
import { SimilarCharacterGame } from '../components/practice/SimilarCharacterGame';
import { MatchGame } from '../components/practice/MatchGame';
import { Flashcard } from '../components/practice/Flashcard';
import { AudioSequenceMemory } from '../components/practice/AudioSequenceMemory';
import { EarTraining } from '../components/practice/EarTraining';
import { TrueFalseGame } from '../components/practice/TrueFalseGame';
import { SessionResults } from '../components/practice/SessionResults';
import { LearningTip } from '../components/common/LearningTip';
import { StrokeOrderViewer } from '../components/practice/StrokeOrderViewer';

import { PracticeMode, FontStyle, FontMode, Difficulty, HiraganaCharacter } from '../types';
import { CharacterProgressMap } from '../hooks/useCharacterProgress';
import { X, ArrowLeft } from 'lucide-react';

interface PracticePageProps {
  selectedRowIds: string[];
  onToggleRow: (rowId: string) => void;
  onSelectAllRows: () => void;
  onClearAllRows: () => void;

  selectedMode: PracticeMode;
  onSelectMode: (mode: PracticeMode) => void;

  questionCount: number;
  onSelectQuestionCount: (count: number) => void;

  currentFont: FontStyle;
  onSelectFont: (font: FontStyle) => void;

  fontMode: FontMode;
  onSelectFontMode: (mode: FontMode) => void;

  difficulty: Difficulty;
  onSelectDifficulty: (diff: Difficulty) => void;

  isActive: boolean;
  isCompleted: boolean;
  currentQuestion: any;
  currentIndex: number;
  totalQuestions: number;
  sessionStats: any;

  onStartPractice: () => void;
  onRecordResult: (isCorrect: boolean, timeTakenSec: number) => void;
  onFinishSession: () => void;
  onQuitSession: () => void;
  onPlayAudio: (text: string) => void;
  onGoHome: () => void;
  onPracticeMistakes: () => void;
  progressMap: CharacterProgressMap;
}

export const PracticePage: React.FC<PracticePageProps> = ({
  selectedRowIds,
  onToggleRow,
  onSelectAllRows,
  onClearAllRows,
  selectedMode,
  onSelectMode,
  questionCount,
  onSelectQuestionCount,
  currentFont,
  onSelectFont,
  fontMode,
  onSelectFontMode,
  difficulty,
  onSelectDifficulty,

  isActive,
  isCompleted,
  currentQuestion,
  currentIndex,
  totalQuestions,
  sessionStats,

  onStartPractice,
  onRecordResult,
  onFinishSession,
  onQuitSession,
  onPlayAudio,
  onGoHome,
  onPracticeMistakes,
}) => {
  const [activeStrokeChar, setActiveStrokeChar] = React.useState<HiraganaCharacter | null>(null);

  const tips = [
    "💡 Active recall helps you remember better. Try to recall the sound before checking!",
    "💡 Practicing Kyōkasho font helps recognize real handwriting shapes.",
    "💡 Don't worry about mistakes — weak characters will repeat automatically.",
    "💡 Focus on stroke order and balance when practicing on the writing canvas."
  ];

  const currentTip = tips[currentIndex % tips.length];

  // 1. Show setup screen if session not started and not finished
  if (!isActive && !isCompleted) {
    return (
      <PracticeSetup
        selectedRowIds={selectedRowIds}
        onToggleRow={onToggleRow}
        onSelectAllRows={onSelectAllRows}
        onClearAllRows={onClearAllRows}
        selectedMode={selectedMode}
        onSelectMode={onSelectMode}
        questionCount={questionCount}
        onSelectQuestionCount={onSelectQuestionCount}
        currentFont={currentFont}
        onSelectFont={onSelectFont}
        fontMode={fontMode}
        onSelectFontMode={onSelectFontMode}
        difficulty={difficulty}
        onSelectDifficulty={onSelectDifficulty}
        onStartPractice={onStartPractice}
        onPlayAudio={onPlayAudio}
      />
    );
  }

  // 2. Show Session Results if completed
  if (isCompleted) {
    return (
      <SessionResults
        stats={sessionStats}
        activeFont={currentFont}
        onPracticeMistakes={onPracticeMistakes}
        onTryAgain={onStartPractice}
        onChangeSetup={onGoHome}
        onGoHome={onGoHome}
        onPlayAudio={onPlayAudio}
      />
    );
  }

  // 3. Render Standalone Full-Session Modes (Sequence Memory, Match Up, Spot Difference)
  if (selectedMode === 'sequence-memory') {
    return (
      <div className="h-full min-h-0 flex flex-col justify-between space-y-2 py-0 overflow-hidden">
        <div className="flex justify-between items-center max-w-2xl mx-auto w-full shrink-0">
          <button
            onClick={onQuitSession}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFDF8] border border-[#DDD7CB] text-xs font-extrabold text-[#30312F] hover:bg-[#F8E5E0] hover:border-[#D96F61] hover:text-[#D96F61] transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#66765B]" />
            <span>Exit Game & Setup New</span>
          </button>
        </div>
        <div className="flex-1 min-h-0 flex flex-col justify-center my-auto overflow-hidden">
          <AudioSequenceMemory
            activeFont={currentFont}
            selectedRowIds={selectedRowIds}
            onPlayAudio={onPlayAudio}
            onFinish={() => onFinishSession()}
          />
        </div>
      </div>
    );
  }

  if (selectedMode === 'match-up' || selectedMode === 'match') {
    return (
      <div className="h-full min-h-0 flex flex-col justify-between space-y-2 py-0 overflow-hidden">
        <div className="flex justify-between items-center max-w-xl mx-auto w-full shrink-0">
          <button
            onClick={onQuitSession}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFDF8] border border-[#DDD7CB] text-xs font-extrabold text-[#30312F] hover:bg-[#F8E5E0] hover:border-[#D96F61] hover:text-[#D96F61] transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#66765B]" />
            <span>Exit Match Up & Setup New</span>
          </button>
        </div>
        <div className="flex-1 min-h-0 flex flex-col justify-center my-auto overflow-hidden">
          <MatchGame
            activeFont={currentFont}
            selectedRowIds={selectedRowIds}
            onPlayAudio={onPlayAudio}
            onFinish={() => onFinishSession()}
          />
        </div>
      </div>
    );
  }

  if (selectedMode === 'spot-difference' || selectedMode === 'similar') {
    return (
      <div className="h-full min-h-0 flex flex-col justify-between space-y-2 py-0 overflow-hidden">
        <div className="flex justify-between items-center max-w-xl mx-auto w-full shrink-0">
          <button
            onClick={onQuitSession}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFDF8] border border-[#DDD7CB] text-xs font-extrabold text-[#30312F] hover:bg-[#F8E5E0] hover:border-[#D96F61] hover:text-[#D96F61] transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#66765B]" />
            <span>Exit Spot Difference & Setup New</span>
          </button>
        </div>
        <div className="flex-1 min-h-0 flex flex-col justify-center my-auto overflow-hidden">
          <SimilarCharacterGame
            currentFont={currentFont}
            selectedRowIds={selectedRowIds}
            onChangeFont={onSelectFont}
            onPlayAudio={onPlayAudio}
            onFinish={() => onFinishSession()}
          />
        </div>
      </div>
    );
  }

  // 4. Standard Active Question Router
  if (!currentQuestion) return null;

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const qMode = currentQuestion.mode;

  return (
    <div className="max-w-xl mx-auto h-full min-h-0 flex flex-col justify-between space-y-2 py-0 animate-pageTransition overflow-hidden">
      
      {/* Top Question Progress Header */}
      <div className="flex items-center justify-between gap-2.5 bg-[#FFFDF8] p-2.5 sm:p-3.5 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] shrink-0">
        <button
          onClick={onQuitSession}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F4F1E9] border border-[#DDD7CB] text-[#6F716C] hover:bg-[#F8E5E0] hover:border-[#D96F61] hover:text-[#D96F61] text-[11px] font-extrabold transition-all shrink-0 shadow-xs"
          title="Quit session and return to studio setup"
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quit / Setup New</span>
        </button>

        <div className="flex-1 flex flex-col items-center max-w-xs mx-auto">
          <div className="text-[11px] font-bold text-[#30312F] mb-0.5">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
          <div className="w-full h-1.5 bg-[#E8E4DA] rounded-full overflow-hidden border border-[#E6E0D4]">
            <div
              className="h-full bg-[#8B9B7A] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <span className="text-[10px] font-black text-[#66765B] bg-[#E5EBDD] border border-[#CCD6C2] px-2.5 py-0.5 rounded-full">
          {progressPercent}%
        </span>
      </div>

      {/* Render Active Question Subcomponent */}
      <div className="flex-1 min-h-0 flex flex-col justify-center my-auto overflow-hidden">
        {(qMode === 'read-it' || qMode === 'char-to-sound') && (
          <CharacterToSound
            question={currentQuestion}
            activeFont={currentFont}
            onAnswer={onRecordResult}
            onPlayAudio={onPlayAudio}
          />
        )}

        {(qMode === 'build-it' || qMode === 'sound-to-char') && (
          <SoundToCharacter
            question={currentQuestion}
            activeFont={currentFont}
            onAnswer={onRecordResult}
            onPlayAudio={onPlayAudio}
          />
        )}

        {qMode === 'true-false' && (
          <TrueFalseGame
            question={currentQuestion}
            activeFont={currentFont}
            onAnswer={onRecordResult}
            onPlayAudio={onPlayAudio}
          />
        )}

        {qMode === 'ear-training' && (
          <EarTraining
            question={currentQuestion}
            activeFont={currentFont}
            onAnswer={onRecordResult}
            onPlayAudio={onPlayAudio}
          />
        )}

        {(qMode === 'pure-recall' || qMode === 'true-recall') && (
          <TrueRecall
            question={currentQuestion}
            activeFont={currentFont}
            isReverse={false}
            onAnswer={onRecordResult}
            onPlayAudio={onPlayAudio}
          />
        )}

        {(qMode === 'write-it' || qMode === 'writing') && (
          <WritingCanvas
            question={currentQuestion}
            activeFont={currentFont}
            onAnswer={onRecordResult}
            onPlayAudio={onPlayAudio}
            onOpenStrokeGuide={() => setActiveStrokeChar(currentQuestion.character)}
          />
        )}

        {qMode === 'speed-recall' && (
          <SpeedRecall
            question={currentQuestion}
            activeFont={currentFont}
            difficulty={difficulty}
            onAnswer={onRecordResult}
            onPlayAudio={onPlayAudio}
          />
        )}

        {qMode === 'flashcard' && (
          <Flashcard
            question={currentQuestion}
            activeFont={currentFont}
            onAnswer={(_, time) => onRecordResult(true, time)}
            onPlayAudio={onPlayAudio}
          />
        )}
      </div>

      {/* Contextual Learning Tip (Hidden on mobile during active gameplay) */}
      <div className="shrink-0 hidden sm:block">
        <LearningTip tipText={currentTip} />
      </div>

      {/* Stroke Order Overlay Modal */}
      {activeStrokeChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <StrokeOrderViewer
            character={activeStrokeChar}
            activeFont={currentFont}
            onClose={() => setActiveStrokeChar(null)}
            onPlayAudio={onPlayAudio}
          />
        </div>
      )}

    </div>
  );
};
