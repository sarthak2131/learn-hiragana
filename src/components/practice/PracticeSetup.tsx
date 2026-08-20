import React from 'react';
import { RowSelector } from '../common/RowSelector';
import { FontSelector } from '../common/FontSelector';
import { PracticeMode, FontStyle, FontMode, Difficulty } from '../../types';
import { 
  Play, 
  Sparkles, 
  HelpCircle, 
  Eye, 
  Edit3, 
  Zap, 
  Shuffle, 
  Layers, 
  Grid2X2, 
  BookOpen 
} from 'lucide-react';

interface PracticeSetupProps {
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
  onStartPractice: () => void;
}

export const PracticeSetup: React.FC<PracticeSetupProps> = ({
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
  onStartPractice
}) => {
  const modes: { id: PracticeMode; label: string; subLabel: string; desc: string; icon: any }[] = [
    { id: 'read-it', label: 'Read It', subLabel: 'Character → Sound', desc: 'See さ, pick sound "sa"', icon: HelpCircle },
    { id: 'build-it', label: 'Build It', subLabel: 'Sound → Character', desc: 'See "shi", pick し', icon: BookOpen },
    { id: 'pure-recall', label: 'Pure Recall', subLabel: 'True Recall', desc: 'Mental recall without choices', icon: Eye },
    { id: 'write-it', label: 'Write It', subLabel: 'Handwriting', desc: 'Draw Hiragana on canvas', icon: Edit3 },
    { id: 'match-up', label: 'Match Up', subLabel: 'Matching', desc: 'Interactive column matching game', icon: Grid2X2 },
    { id: 'spot-difference', label: 'Spot the Difference', subLabel: 'Similar Characters', desc: 'Distinguish さ vs き, ぬ vs め', icon: Layers },
    { id: 'speed-recall', label: 'Speed Recall', subLabel: 'Fast Recognition', desc: 'Timer recall challenge', icon: Zap },
    { id: 'mixed-challenge', label: 'Mixed Challenge', subLabel: 'Complete Mastery', desc: 'Random mix of all question types', icon: Shuffle },
    { id: 'flashcard', label: 'Flashcards', subLabel: 'Leitner Study Cards', desc: 'Interactive 3D study cards', icon: Sparkles },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fadeIn">
      
      {/* Setup Hero Card */}
      <div className="bg-gradient-to-br from-rose-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customize Your Practice</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Hiragana Game Studio</h2>
          <p className="text-sm opacity-90 mt-1 max-w-md">
            Choose your games, rows, Japanese practice font, and speed difficulty.
          </p>
        </div>

        <button
          onClick={onStartPractice}
          disabled={selectedRowIds.length === 0}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-rose-600 font-extrabold text-base shadow-2xl hover:bg-slate-100 hover:scale-105 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          <span>Start Practice</span>
          <Play className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* 1. Row Selection */}
      <RowSelector
        selectedRowIds={selectedRowIds}
        onToggleRow={onToggleRow}
        onSelectAll={onSelectAllRows}
        onClearAll={onClearAllRows}
        currentFont={currentFont}
      />

      {/* 2. Practice Games Grid */}
      <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Choose Practice Game</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Select how you want to train your active recall</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modes.map(m => {
            const Icon = m.icon;
            // Match both new ID and legacy aliases
            const isSelected = selectedMode === m.id || 
              (m.id === 'read-it' && selectedMode === 'char-to-sound') ||
              (m.id === 'build-it' && selectedMode === 'sound-to-char') ||
              (m.id === 'pure-recall' && selectedMode === 'true-recall') ||
              (m.id === 'write-it' && selectedMode === 'writing') ||
              (m.id === 'match-up' && selectedMode === 'match') ||
              (m.id === 'spot-difference' && selectedMode === 'similar') ||
              (m.id === 'mixed-challenge' && selectedMode === 'mixed');

            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 dark:border-rose-500 ring-2 ring-rose-500/20'
                    : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">{m.label}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                      {m.subLabel}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{m.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Font Selection Section */}
      <FontSelector
        currentFont={currentFont}
        onSelectFont={onSelectFont}
        fontMode={fontMode}
        onSelectFontMode={onSelectFontMode}
        isEmbedded={true}
      />

      {/* 4. Question Count & Difficulty options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Questions Count */}
        <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Questions per session
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[10, 20, 30, 50, 999].map(cnt => (
              <button
                key={cnt}
                onClick={() => onSelectQuestionCount(cnt)}
                className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                  questionCount === cnt
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {cnt === 999 ? '∞' : cnt}
              </button>
            ))}
          </div>
        </div>

        {/* Speed recall difficulty */}
        <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Difficulty Tier
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'relaxed', label: 'Relaxed' },
              { id: 'normal', label: 'Normal' },
              { id: 'fast', label: 'Fast' },
              { id: 'extreme', label: 'Extreme' },
            ].map(d => (
              <button
                key={d.id}
                onClick={() => onSelectDifficulty(d.id as Difficulty)}
                className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                  difficulty === d.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button Footer */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onStartPractice}
          disabled={selectedRowIds.length === 0}
          className="w-full sm:w-80 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-extrabold text-lg shadow-xl shadow-rose-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          <span>Start Game Session →</span>
        </button>
      </div>

    </div>
  );
};
