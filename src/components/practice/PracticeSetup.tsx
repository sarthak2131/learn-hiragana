import React from 'react';
import { 
  Play, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Eye, 
  Edit3, 
  Grid2X2, 
  Layers, 
  Zap, 
  Shuffle, 
  Check, 
  ListOrdered,
  Radio,
  Type,
  CheckCheck
} from 'lucide-react';
import { HIRAGANA_ROWS } from '../../data/hiraganaData';
import { PracticeMode, FontStyle, FontMode, Difficulty } from '../../types';
import { FONT_CLASSES, FONT_DESCRIPTIONS } from '../../hooks/useFont';

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
  onStartPractice,
}) => {

  const gameModes: { id: PracticeMode; title: string; subTitle: string; desc: string; icon: any }[] = [
    { id: 'read-it', title: 'Read It', subTitle: 'Character → Sound', desc: 'See さ, pick sound "sa"', icon: HelpCircle },
    { id: 'build-it', title: 'Build It', subTitle: 'Sound → Character', desc: 'See "shi", pick し', icon: BookOpen },
    { id: 'true-false', title: 'Rapid True / False', subTitle: '2-Sec Binary Test', desc: 'Is し = "shi"? Tap TRUE (✔️) or FALSE (❌) in 2 seconds', icon: CheckCheck },
    { id: 'sequence-memory', title: 'Sequence Memory', subTitle: 'Simons Says Recall', desc: 'Listen to 3, 5, 8 or 10 spoken sounds & tap tiles in order', icon: ListOrdered },
    { id: 'ear-training', title: 'Ear Training', subTitle: 'Audio Blind Test', desc: 'Listen to spoken sound with text hidden & pick character', icon: Radio },
    { id: 'pure-recall', title: 'Pure Recall', subTitle: 'True Recall', desc: 'Mental recall without choices', icon: Eye },
    { id: 'write-it', title: 'Write It', subTitle: 'Handwriting', desc: 'Draw Hiragana on canvas', icon: Edit3 },
    { id: 'match-up', title: 'Match Up', subTitle: 'Matching', desc: 'Interactive 2-column matching game', icon: Grid2X2 },
    { id: 'spot-difference', title: 'Spot Difference', subTitle: 'Similar Chars', desc: 'Distinguish さ vs き, ぬ vs め', icon: Layers },
    { id: 'speed-recall', title: 'Speed Recall', subTitle: 'Fast Recognition', desc: 'Timer recall challenge up to 3x', icon: Zap },
    { id: 'mixed-challenge', title: 'Mixed Challenge', subTitle: 'Complete Mastery', desc: 'Random mix of all question types', icon: Shuffle },
  ];

  const fontOptions: FontStyle[] = ['kyokasho', 'mincho', 'gothic'];
  const countOptions = [10, 20, 30, 50];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#151c2c] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Practice Session Studio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
            Configure Practice Session
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select game mode, characters rows to practice, and target question count.
          </p>
        </div>

        <button
          onClick={onStartPractice}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-base shadow-xl shadow-rose-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2.5 shrink-0"
        >
          <span>Start Session</span>
          <Play className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* 1. Select Game Mode Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>1. Select Game Mode</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {gameModes.map(g => {
            const Icon = g.icon;
            const isSelected = selectedMode === g.id;

            return (
              <button
                key={g.id}
                onClick={() => onSelectMode(g.id)}
                className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-500/10 border-rose-500 text-slate-900 dark:text-white ring-4 ring-rose-500/10 scale-[1.02]'
                    : 'bg-white dark:bg-[#151c2c] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-rose-400 dark:hover:border-rose-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-rose-500 font-extrabold" />}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {g.title}
                  </h3>
                  <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    {g.subTitle}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {g.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Select Character Rows Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            2. Select Character Rows ({selectedRowIds.length} Rows Selected)
          </h2>

          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={onSelectAllRows}
              className="text-rose-600 dark:text-rose-400 hover:underline"
            >
              Select All
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={onClearAllRows}
              className="text-slate-500 hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {HIRAGANA_ROWS.map(row => {
            const isSelected = selectedRowIds.includes(row.id);

            return (
              <button
                key={row.id}
                onClick={() => onToggleRow(row.id)}
                className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? 'bg-rose-500/10 border-rose-500 text-slate-900 dark:text-white'
                    : 'bg-white dark:bg-[#151c2c] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-rose-400'
                }`}
              >
                <div>
                  <div className="text-xs font-extrabold uppercase text-slate-400">Row {row.name}</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5" style={{ fontFamily: FONT_DESCRIPTIONS[currentFont].title }}>
                    {row.label}
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
                  isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 dark:border-slate-700'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Settings (Question Count & Font Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Dynamic Question Count or Game Deck Info */}
        {['read-it', 'build-it', 'true-false', 'ear-training', 'pure-recall', 'speed-recall', 'mixed-challenge'].includes(selectedMode) ? (
          <div className="bg-white dark:bg-[#151c2c] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Question Count</span>
              <span className="text-xs text-rose-500 font-bold">{questionCount} Questions</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {countOptions.map(cnt => (
                <button
                  key={cnt}
                  onClick={() => onSelectQuestionCount(cnt)}
                  className={`py-3 rounded-2xl border-2 text-xs font-extrabold transition-all ${
                    questionCount === cnt
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-rose-400'
                  }`}
                >
                  {cnt} Qs
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#151c2c] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-center">
            <div className="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Game Mode Configuration
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {gameModes.find(g => g.id === selectedMode)?.title} Mode
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deck size and targets are automatically generated from your selected character rows ({selectedRowIds.length} rows active).
            </p>
          </div>
        )}

        {/* Font Style Selection */}
        <div className="bg-white dark:bg-[#151c2c] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Type className="w-4 h-4 text-rose-500" />
            <span>Practice Font Style</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {fontOptions.map(f => (
              <button
                key={f}
                onClick={() => onSelectFont(f)}
                className={`py-3 rounded-2xl border-2 text-xs font-extrabold transition-all capitalize ${
                  currentFont === f
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-rose-400'
                }`}
              >
                {FONT_DESCRIPTIONS[f].title}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Prominent Bottom Start Practice Session Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#151c2c] to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Configuration Complete</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-1">
            Ready to Start {gameModes.find(g => g.id === selectedMode)?.title}?
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {selectedRowIds.length} Character Rows Selected • {currentFont.toUpperCase()} Font Style
          </p>
        </div>

        <button
          onClick={onStartPractice}
          className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-lg shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shrink-0"
        >
          <span>Start Practice Session</span>
          <Play className="w-6 h-6 fill-current" />
        </button>
      </div>

    </div>
  );
};
