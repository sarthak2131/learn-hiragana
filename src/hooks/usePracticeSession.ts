import { useState, useCallback } from 'react';
import { HIRAGANA_DATA } from '../data/hiraganaData';
import { HiraganaCharacter, PracticeMode, Question, SessionStats, FontStyle } from '../types/index';
import { CharacterProgressMap } from './useCharacterProgress';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function usePracticeSession() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    scorePercent: 0,
    avgTimeSeconds: 0,
    bestStreak: 0,
    missedCharacters: []
  });

  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [missedChars, setMissedChars] = useState<string[]>([]);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);

  const startSession = useCallback((
    selectedRowIds: string[],
    mode: PracticeMode,
    questionCount: number,
    fontMode: 'selected' | 'random',
    activeFont: FontStyle,
    progressMap: CharacterProgressMap,
    specificCharSet?: HiraganaCharacter[]
  ) => {
    let pool: HiraganaCharacter[] = [];
    if (specificCharSet && specificCharSet.length > 0) {
      pool = specificCharSet;
    } else {
      pool = HIRAGANA_DATA.filter(c => selectedRowIds.includes(c.row));
    }

    if (pool.length === 0) {
      pool = HIRAGANA_DATA;
    }

    const weightedPool: HiraganaCharacter[] = [];
    pool.forEach(char => {
      const prog = progressMap[char.character];
      let weight = 1;
      if (prog) {
        if (prog.confidence < 40) weight = 4;
        else if (prog.confidence < 70) weight = 3;
        else if (prog.confidence < 85) weight = 2;
      }
      for (let w = 0; w < weight; w++) {
        weightedPool.push(char);
      }
    });

    const generated: Question[] = [];
    const targetCount = questionCount > 100 ? 50 : questionCount;
    let lastChar: string | null = null;

    const availableFonts: FontStyle[] = ['kyokasho', 'mincho', 'gothic'];

    const effectiveSubModes: PracticeMode[] = [
      'read-it',
      'build-it',
      'pure-recall',
      'write-it',
      'speed-recall'
    ];

    for (let i = 0; i < targetCount; i++) {
      let eligible = weightedPool.filter(c => c.character !== lastChar);
      if (eligible.length === 0) eligible = weightedPool;
      const targetChar = eligible[Math.floor(Math.random() * eligible.length)];
      lastChar = targetChar.character;

      let currentQuestionMode: PracticeMode = mode;
      if (mode === 'mixed-challenge' || mode === 'mixed') {
        currentQuestionMode = effectiveSubModes[Math.floor(Math.random() * effectiveSubModes.length)];
      }

      const displayFont = fontMode === 'random'
        ? availableFonts[Math.floor(Math.random() * availableFonts.length)]
        : activeFont;

      let options: string[] = [];
      let correctAnswer = '';

      if (currentQuestionMode === 'read-it' || currentQuestionMode === 'char-to-sound' || currentQuestionMode === 'speed-recall') {
        correctAnswer = targetChar.romanization;
        const distractorPool = HIRAGANA_DATA
          .filter(c => c.romanization !== targetChar.romanization)
          .map(c => c.romanization);
        const wrongOptions = shuffle(distractorPool).slice(0, 3);
        options = shuffle([correctAnswer, ...wrongOptions]);
      } else if (currentQuestionMode === 'build-it' || currentQuestionMode === 'sound-to-char') {
        correctAnswer = targetChar.character;
        const distractorPool = HIRAGANA_DATA
          .filter(c => c.character !== targetChar.character)
          .map(c => c.character);
        const wrongOptions = shuffle(distractorPool).slice(0, 3);
        options = shuffle([correctAnswer, ...wrongOptions]);
      } else {
        correctAnswer = targetChar.romanization;
      }

      generated.push({
        id: `q_${i}_${Date.now()}`,
        mode: currentQuestionMode,
        character: targetChar,
        prompt: (currentQuestionMode === 'build-it' || currentQuestionMode === 'sound-to-char' || currentQuestionMode === 'write-it' || currentQuestionMode === 'writing')
          ? targetChar.romanization
          : targetChar.character,
        displayFont,
        options,
        correctAnswer
      });
    }

    setQuestions(generated);
    setCurrentIndex(0);
    setIsActive(true);
    setIsCompleted(false);
    setCurrentStreak(0);
    setMaxStreak(0);
    setMissedChars([]);
    setResponseTimes([]);
    setStartTime(Date.now());
  }, []);

  const recordQuestionResult = useCallback((isCorrect: boolean, timeTakenSec: number = 2.0) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setResponseTimes(prev => [...prev, timeTakenSec]);

    if (isCorrect) {
      setCurrentStreak(prev => {
        const next = prev + 1;
        setMaxStreak(m => Math.max(m, next));
        return next;
      });
    } else {
      setCurrentStreak(0);
      setMissedChars(prev => prev.includes(currentQ.character.character) ? prev : [...prev, currentQ.character.character]);
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishSession(isCorrect, timeTakenSec);
    }
  }, [questions, currentIndex]);

  const finishSession = useCallback((lastIsCorrect: boolean = true, lastTimeSec: number = 2.0) => {
    setIsActive(false);
    setIsCompleted(true);

    const total = questions.length;
    const finalMissed = !lastIsCorrect && questions[currentIndex]
      ? (missedChars.includes(questions[currentIndex].character.character) ? missedChars : [...missedChars, questions[currentIndex].character.character])
      : missedChars;

    const correctCount = total - finalMissed.length;
    const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    
    const times = [...responseTimes, lastTimeSec];
    const avgTime = times.length > 0 ? Number((times.reduce((a, b) => a + b, 0) / times.length).toFixed(1)) : 2.5;

    setSessionStats({
      totalQuestions: total,
      correctAnswers: correctCount,
      incorrectAnswers: finalMissed.length,
      scorePercent,
      avgTimeSeconds: avgTime,
      bestStreak: maxStreak,
      missedCharacters: finalMissed
    });
  }, [questions, currentIndex, missedChars, responseTimes, maxStreak]);

  const currentQuestion = questions[currentIndex];

  return {
    questions,
    currentIndex,
    currentQuestion,
    isActive,
    isCompleted,
    sessionStats,
    currentStreak,
    maxStreak,
    startSession,
    recordQuestionResult,
    finishSession
  };
}
