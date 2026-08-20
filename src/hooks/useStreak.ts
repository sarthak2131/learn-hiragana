import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type StreakState = {
  currentStreak: number;
  todayQuestionCount: number;
  totalPracticeTimeSeconds: number;
  lastPracticeDate: string | null;
};

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getYesterdayKey(date = new Date()) {
  const previous = new Date(date);
  previous.setDate(previous.getDate() - 1);
  return getDateKey(previous);
}

export function useStreak() {
  const [streakData, setStreakData] = useLocalStorage<StreakState>('hiragana_streak_state', {
    currentStreak: 0,
    todayQuestionCount: 0,
    totalPracticeTimeSeconds: 0,
    lastPracticeDate: null,
  });

  const recordPractice = useCallback((questionCount: number, timeTakenSec: number) => {
    const today = getDateKey();
    setStreakData((prev) => {
      const isNewDay = prev.lastPracticeDate !== today;
      const maintainsStreak = prev.lastPracticeDate === getYesterdayKey() || prev.lastPracticeDate === today;

      return {
        currentStreak: isNewDay
          ? (maintainsStreak ? prev.currentStreak + 1 : 1)
          : prev.currentStreak,
        todayQuestionCount: isNewDay ? questionCount : prev.todayQuestionCount + questionCount,
        totalPracticeTimeSeconds: prev.totalPracticeTimeSeconds + timeTakenSec,
        lastPracticeDate: today,
      };
    });
  }, [setStreakData]);

  useEffect(() => {
    const today = getDateKey();
    setStreakData((prev) => {
      if (prev.lastPracticeDate === today) {
        return prev;
      }

      return {
        ...prev,
        todayQuestionCount: 0,
      };
    });
  }, [setStreakData]);

  return {
    streakData,
    recordPractice,
  };
}
