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
  onPlayAudio,
  onGoHome,
  onPracticeMistakes,
}) => {
  const [activeStrokeChar, setActiveStrokeChar] = React.useState<HiraganaCharacter | null>(null);

  const tips = [
    "💡 Recognition is easier than recall. Try answering before looking at the choices.",
    "💡 Character shapes vary across fonts. Practicing Kyōkasho helps handwriting!",
    "💡 Don't worry about making mistakes — weak characters will automatically repeat more often.",
    "💡 Focus on stroke direction when practicing on the writing canvas."
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

  // 3. Render Standalone Full-Session Modes (Match Up, Audio Sequence Memory, Spot Difference)
  if (selectedMode === 'sequence-memory') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Audio Sequence Memory</span>
          </button>
        </div>
        <AudioSequenceMemory
          activeFont={currentFont}
          onPlayAudio={onPlayAudio}
          onFinish={() => onFinishSession()}
        />
      </div>
    );
  }

  if (selectedMode === 'match-up' || selectedMode === 'match') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Match Up</span>
          </button>
        </div>
        <MatchGame
          activeFont={currentFont}
          selectedRowIds={selectedRowIds}
          onPlayAudio={onPlayAudio}
          onFinish={() => onFinishSession()}
        />
      </div>
    );
  }

  if (selectedMode === 'spot-difference' || selectedMode === 'similar') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Spot the Difference</span>
          </button>
        </div>
        <SimilarCharacterGame
          currentFont={currentFont}
          onChangeFont={onSelectFont}
          onPlayAudio={onPlayAudio}
          onFinish={() => onFinishSession()}
        />
      </div>
    );
  }

  // 4. Standard Active Question Router
  if (!currentQuestion) return null;

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const qMode = currentQuestion.mode;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 animate-fadeIn">
      
      {/* Top Question Progress Header */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-[#151c2c] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={onGoHome}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Quit Session"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 flex flex-col items-center">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg">
          {progressPercent}%
        </span>
      </div>

      {/* Render Active Question Subcomponent */}
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

      {/* Contextual Learning Tip */}
      <LearningTip tipText={currentTip} />

      {/* Stroke Order Overlay Modal */}
      {activeStrokeChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
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
