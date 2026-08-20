import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { CharacterProgress, MasteryStatus } from '../types/index';
import { HIRAGANA_DATA } from '../data/hiraganaData';

export type CharacterProgressMap = Record<string, CharacterProgress>;

const calculateMastery = (attempts: number, correct: number, streak: number, confidence: number): MasteryStatus => {
  if (attempts === 0) return 'not-started';
  if (attempts < 4 || confidence < 40) return 'learning';
  if (confidence < 70) return 'practicing';
  if (confidence < 85 || streak < 3) return 'strong';
  return 'mastered';
};

export function useCharacterProgress() {
  const [progressMap, setProgressMap] = useLocalStorage<CharacterProgressMap>('hiragana_character_progress', {});

  const getProgress = useCallback((char: string): CharacterProgress => {
    if (progressMap[char]) {
      return progressMap[char];
    }
    return {
      character: char,
      attempts: 0,
      correct: 0,
      incorrect: 0,
      streak: 0,
      confidence: 0,
      averageResponseTime: 0,
      lastSeen: 0,
      mastery: 'not-started'
    };
  }, [progressMap]);

  const recordAttempt = useCallback((
    char: string, 
    isCorrect: boolean, 
    responseTimeSec: number = 2.5
  ) => {
    setProgressMap(prev => {
      const current = prev[char] || {
        character: char,
        attempts: 0,
        correct: 0,
        incorrect: 0,
        streak: 0,
        confidence: 0,
        averageResponseTime: 0,
        lastSeen: 0,
        mastery: 'not-started'
      };

      const newAttempts = current.attempts + 1;
      const newCorrect = isCorrect ? current.correct + 1 : current.correct;
      const newIncorrect = !isCorrect ? current.incorrect + 1 : current.incorrect;
      const newStreak = isCorrect ? current.streak + 1 : 0;

      const accuracyRatio = newCorrect / newAttempts;
      const streakBonus = Math.min(newStreak * 5, 25);
      const rawConfidence = Math.round((accuracyRatio * 75) + streakBonus);
      const newConfidence = Math.min(Math.max(rawConfidence, 0), 100);

      const newAvgTime = current.averageResponseTime === 0
        ? responseTimeSec
        : Number(((current.averageResponseTime * 0.7) + (responseTimeSec * 0.3)).toFixed(2));

      const newMastery = calculateMastery(newAttempts, newCorrect, newStreak, newConfidence);

      return {
        ...prev,
        [char]: {
          character: char,
          attempts: newAttempts,
          correct: newCorrect,
          incorrect: newIncorrect,
          streak: newStreak,
          confidence: newConfidence,
          averageResponseTime: newAvgTime,
          lastSeen: Date.now(),
          mastery: newMastery
        }
      };
    });
  }, [setProgressMap]);

  const getOverallStats = useCallback(() => {
    const allChars = HIRAGANA_DATA.map(c => c.character);
    let totalAttempts = 0;
    let totalCorrect = 0;
    let practicedCount = 0;
    let masteredCount = 0;

    allChars.forEach(char => {
      const prog = getProgress(char);
      if (prog.attempts > 0) {
        practicedCount++;
        totalAttempts += prog.attempts;
        totalCorrect += prog.correct;
      }
      if (prog.mastery === 'mastered') {
        masteredCount++;
      }
    });

    const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const overallMasteryPercent = Math.round((masteredCount / allChars.length) * 100);

    return {
      totalAttempts,
      totalCorrect,
      practicedCount,
      totalCount: allChars.length,
      masteredCount,
      overallAccuracy,
      overallMasteryPercent
    };
  }, [getProgress]);

  const resetAllProgress = useCallback(() => {
    setProgressMap({});
  }, [setProgressMap]);

  const getWeakCharacters = useCallback((limit: number = 8): string[] => {
    return HIRAGANA_DATA
      .map(c => getProgress(c.character))
      .filter(p => p.attempts > 0 && p.mastery !== 'mastered')
      .sort((a, b) => a.confidence - b.confidence)
      .slice(0, limit)
      .map(p => p.character);
  }, [getProgress]);

  return {
    progressMap,
    getProgress,
    recordAttempt,
    getOverallStats,
    resetAllProgress,
    getWeakCharacters
  };
}
