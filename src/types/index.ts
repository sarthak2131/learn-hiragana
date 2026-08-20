export type FontStyle = 'kyokasho' | 'mincho' | 'gothic';

export type FontMode = 'selected' | 'random';

export type PracticeMode = 
  | 'read-it'             // Read It (Character -> Sound)
  | 'build-it'            // Build It (Sound -> Character)
  | 'pure-recall'         // Pure Recall (True Recall)
  | 'write-it'            // Write It (Handwriting)
  | 'match-up'            // Match Up (Matching)
  | 'spot-difference'     // Spot the Difference (Similar characters)
  | 'speed-recall'        // Speed Recall (Fast recognition)
  | 'mixed-challenge'     // Mixed Challenge (Complete mastery)
  | 'flashcard'           // Flashcards (Leitner study)
  | 'char-to-sound'       // Backward compatibility aliases
  | 'sound-to-char'
  | 'true-recall'
  | 'writing'
  | 'similar'
  | 'match'
  | 'mixed';

export type Difficulty = 'relaxed' | 'normal' | 'fast' | 'extreme';

export type MasteryStatus = 'not-started' | 'learning' | 'practicing' | 'strong' | 'mastered';

export interface HiraganaCharacter {
  id: string;
  character: string;
  romanization: string;
  row: string;
  rowName: string;
  exampleWord?: string;
  exampleMeaning?: string;
}

export interface HiraganaRow {
  id: string;
  name: string;
  label: string;
  characters: HiraganaCharacter[];
}

export interface CharacterProgress {
  character: string;
  attempts: number;
  correct: number;
  incorrect: number;
  streak: number;
  confidence: number;
  averageResponseTime: number;
  lastSeen: number;
  mastery: MasteryStatus;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  font: FontStyle;
  fontMode: FontMode;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  dailyGoal: number;
  difficulty: Difficulty;
}

export interface Question {
  id: string;
  mode: PracticeMode;
  character: HiraganaCharacter;
  prompt: string;
  displayFont?: FontStyle;
  options?: string[];
  correctAnswer: string;
}

export interface SessionStats {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  scorePercent: number;
  avgTimeSeconds: number;
  bestStreak: number;
  missedCharacters: string[];
}

export interface MatchPair {
  id: string;
  character: string;
  romanization: string;
  matched: boolean;
}

export interface SimilarPair {
  id: string;
  char1: HiraganaCharacter;
  char2: HiraganaCharacter;
  note: string;
}
