import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { FontSelector } from './components/common/FontSelector';
import { SettingsModal } from './components/common/SettingsModal';
import { CharacterDetailModal } from './components/chart/CharacterDetailModal';

import { HomePage } from './pages/HomePage';
import { PracticePage } from './pages/PracticePage';
import { ChartPage } from './pages/ChartPage';
import { DashboardPage } from './pages/DashboardPage';
import { WritingPage } from './pages/WritingPage';

import { useTheme } from './hooks/useTheme';
import { useFont } from './hooks/useFont';
import { useAudio } from './hooks/useAudio';
import { useStreak } from './hooks/useStreak';
import { useCharacterProgress } from './hooks/useCharacterProgress';
import { usePracticeSession } from './hooks/usePracticeSession';
import { useLocalStorage } from './hooks/useLocalStorage';

import { PracticeMode, UserSettings, HiraganaCharacter } from './types/index';
import { getCharacterByChar } from './data/hiraganaData';

export function App() {
  const { font, setFont, fontMode, setFontMode } = useFont();
  const [settings, setSettings] = useLocalStorage<UserSettings>('hiragana_user_settings', {
    theme: 'system',
    font: 'kyokasho',
    fontMode: 'selected',
    soundEnabled: true,
    animationsEnabled: true,
    dailyGoal: 20,
    difficulty: 'normal'
  });

  // Bind theme switcher directly to document.documentElement via settings.theme
  useTheme(settings.theme);

  const { speakText } = useAudio(settings.soundEnabled);
  const { streakData, recordPractice } = useStreak();
  const { 
    progressMap, 
    recordAttempt, 
    getOverallStats, 
    resetAllProgress, 
    getWeakCharacters,
    getProgress 
  } = useCharacterProgress();

  const {
    questions,
    currentIndex,
    currentQuestion,
    isActive,
    isCompleted,
    sessionStats,
    startSession,
    recordQuestionResult,
    finishSession
  } = usePracticeSession();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'practice' | 'chart' | 'dashboard' | 'writing'>('home');

  // Selected Rows for Practice (Default A, K, S, T)
  const [selectedRowIds, setSelectedRowIds] = useLocalStorage<string[]>('hiragana_selected_rows', ['A', 'K', 'S', 'T']);
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('read-it');
  const [questionCount, setQuestionCount] = useState<number>(20);

  // Modals state
  const [isFontSelectorOpen, setIsFontSelectorOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedDetailChar, setSelectedDetailChar] = useState<HiraganaCharacter | null>(null);

  // Row selection helpers
  const handleToggleRow = (rowId: string) => {
    setSelectedRowIds(prev => {
      if (prev.includes(rowId)) {
        return prev.filter(r => r !== rowId);
      } else {
        return [...prev, rowId];
      }
    });
  };

  const handleSelectAllRows = () => {
    setSelectedRowIds(['A', 'K', 'S', 'T', 'N', 'H', 'M', 'Y', 'R', 'W', 'N_SOLO']);
  };

  const handleClearAllRows = () => {
    setSelectedRowIds([]);
  };

  // Start Practice trigger
  const handleStartPracticeSession = (modeToUse?: PracticeMode, specificChars?: HiraganaCharacter[]) => {
    const activeMode = modeToUse || selectedMode;
    if (modeToUse) {
      setSelectedMode(modeToUse);
    }
    startSession(
      selectedRowIds,
      activeMode,
      questionCount,
      fontMode,
      font,
      progressMap,
      specificChars
    );
    setActiveTab('practice');
  };

  // Single Character Writing Practice Trigger
  const handleStartSingleWritingPractice = (char: HiraganaCharacter) => {
    setSelectedDetailChar(null);
    setSelectedMode('write-it');
    startSession(
      [char.row],
      'write-it',
      10,
      fontMode,
      font,
      progressMap,
      [char]
    );
    setActiveTab('practice');
  };

  // Review Mistakes trigger
  const handleStartMistakeReview = () => {
    const weakChars = getWeakCharacters(10);
    const charObjs = weakChars.map(c => getCharacterByChar(c)).filter(Boolean) as HiraganaCharacter[];
    if (charObjs.length > 0) {
      setSelectedMode('mixed-challenge');
      handleStartPracticeSession('mixed-challenge', charObjs);
    }
  };

  // Question Answer Result handler
  const handleRecordAnswerResult = (isCorrect: boolean, timeTakenSec: number) => {
    if (currentQuestion) {
      const charStr = currentQuestion.character.character;
      recordAttempt(charStr, isCorrect, timeTakenSec);
      recordPractice(1, timeTakenSec);
    }
    recordQuestionResult(isCorrect, timeTakenSec);
  };

  const overallStats = getOverallStats();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 font-sans transition-colors duration-200 pb-20 md:pb-8">
      
      {/* Sticky Header */}
      <Header
        currentFont={font}
        onOpenFontSelector={() => setIsFontSelectorOpen(true)}
        streakCount={streakData.currentStreak}
        todayCount={streakData.todayQuestionCount}
        dailyGoal={settings.dailyGoal}
        settings={settings}
        onUpdateSettings={(newSet) => setSettings(prev => ({ ...prev, ...newSet }))}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNavigateHome={() => setActiveTab('home')}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {activeTab === 'home' && (
          <HomePage
            currentFont={font}
            onOpenFontSelector={() => setIsFontSelectorOpen(true)}
            streakCount={streakData.currentStreak}
            todayCount={streakData.todayQuestionCount}
            dailyGoal={settings.dailyGoal}
            settings={settings}
            onStartPractice={(mode) => {
              handleStartPracticeSession(mode);
            }}
            onViewChart={() => setActiveTab('chart')}
            onViewWriting={() => setActiveTab('writing')}
            onViewDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'practice' && (
          <PracticePage
            selectedRowIds={selectedRowIds}
            onToggleRow={handleToggleRow}
            onSelectAllRows={handleSelectAllRows}
            onClearAllRows={handleClearAllRows}

            selectedMode={selectedMode}
            onSelectMode={setSelectedMode}

            questionCount={questionCount}
            onSelectQuestionCount={setQuestionCount}

            currentFont={font}
            onSelectFont={setFont}

            fontMode={fontMode}
            onSelectFontMode={setFontMode}

            difficulty={settings.difficulty}
            onSelectDifficulty={(d) => setSettings(prev => ({ ...prev, difficulty: d }))}

            isActive={isActive}
            isCompleted={isCompleted}
            currentQuestion={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            sessionStats={sessionStats}

            onStartPractice={() => handleStartPracticeSession()}
            onRecordResult={handleRecordAnswerResult}
            onFinishSession={finishSession}
            onPlayAudio={speakText}
            onGoHome={() => setActiveTab('home')}
            onPracticeMistakes={handleStartMistakeReview}
            progressMap={progressMap}
          />
        )}

        {activeTab === 'chart' && (
          <ChartPage
            activeFont={font}
            onChangeFont={setFont}
            onSelectCharacter={(charStr) => {
              const charObj = getCharacterByChar(charStr);
              if (charObj) setSelectedDetailChar(charObj);
            }}
            onPlayAudio={speakText}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            progressMap={progressMap}
            overallStats={overallStats}
            streakCount={streakData.currentStreak}
            totalPracticeTimeSeconds={streakData.totalPracticeTimeSeconds}
            activeFont={font}
            onSelectCharacter={(charStr) => {
              const charObj = getCharacterByChar(charStr);
              if (charObj) setSelectedDetailChar(charObj);
            }}
            onReviewMistakes={handleStartMistakeReview}
            onStartPractice={() => {
              setActiveTab('practice');
            }}
          />
        )}

        {activeTab === 'writing' && (
          <WritingPage
            activeFont={font}
            onPlayAudio={speakText}
            onStartWritingPractice={handleStartSingleWritingPractice}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Font Selector Modal */}
      <FontSelector
        currentFont={font}
        onSelectFont={setFont}
        fontMode={fontMode}
        onSelectFontMode={setFontMode}
        isOpen={isFontSelectorOpen}
        onClose={() => setIsFontSelectorOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSet) => setSettings(prev => ({ ...prev, ...newSet }))}
        onResetProgress={resetAllProgress}
      />

      {/* Character Detail Modal */}
      {selectedDetailChar && (
        <CharacterDetailModal
          character={selectedDetailChar}
          activeFont={font}
          onChangeFont={setFont}
          progress={getProgress(selectedDetailChar.character)}
          onClose={() => setSelectedDetailChar(null)}
          onPlayAudio={speakText}
          onStartSinglePractice={handleStartSingleWritingPractice}
        />
      )}

    </div>
  );
}
