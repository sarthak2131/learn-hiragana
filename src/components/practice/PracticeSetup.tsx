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
  CheckCheck,
  ArrowRight,
  AlertCircle
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

  const gameModes: { id: PracticeMode; title: string; category: string; desc: string; icon: any }[] = [
    { id: 'read-it', title: 'Read It', category: 'Character → Sound', desc: 'See さ, pick sound "sa"', icon: HelpCircle },
    { id: 'build-it', title: 'Build It', category: 'Sound → Character', desc: 'See "shi", pick し', icon: BookOpen },
    { id: 'match-up', title: 'Match Up', category: 'Matching', desc: 'Interactive 2-column matching game', icon: Grid2X2 },
    { id: 'true-false', title: 'Rapid True / False', category: '2-Sec Binary Test', desc: 'Is し = "shi"? Tap TRUE (✔️) or FALSE (❌)', icon: CheckCheck },
    { id: 'sequence-memory', title: 'Sequence Memory', category: 'Simons Says Recall', desc: 'Listen to spoken sounds & tap in order', icon: ListOrdered },
    { id: 'ear-training', title: 'Ear Training', category: 'Audio Blind Test', desc: 'Listen to spoken sound & pick character', icon: Radio },
    { id: 'pure-recall', title: 'Pure Recall', category: 'True Recall', desc: 'Mental recall without choices', icon: Eye },
    { id: 'write-it', title: 'Write It', category: 'Handwriting', desc: 'Draw Hiragana on canvas', icon: Edit3 },
    { id: 'spot-difference', title: 'Spot Difference', category: 'Similar Chars', desc: 'Distinguish さ vs き, ぬ vs め', icon: Layers },
    { id: 'speed-recall', title: 'Speed Recall', category: 'Fast Recognition', desc: 'Timer recall challenge up to 3x', icon: Zap },
    { id: 'mixed-challenge', title: 'Mixed Challenge', category: 'Complete Mastery', desc: 'Random mix of all question types', icon: Shuffle },
  ];

  const fontOptions: FontStyle[] = ['kyokasho', 'mincho', 'gothic'];
  const countOptions = [10, 20, 30, 50];

  const isQuestionBasedGame = ['read-it', 'build-it', 'true-false', 'ear-training', 'pure-recall', 'speed-recall', 'mixed-challenge'].includes(selectedMode);
  const isValidConfig = selectedRowIds.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 animate-pageTransition">
      
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-[#111522] p-6 sm:p-8 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5] dark:text-[#818CF8] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRACTICE SESSION STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#151827] dark:text-[#F8FAFC] mt-1">
            Configure Practice Session
          </h1>
          <p className="text-xs text-[#475069] dark:text-[#A8B0C2] mt-1">
            Follow steps 1–5 to customize your active recall practice.
          </p>
        </div>

        <button
          onClick={onStartPractice}
          disabled={!isValidConfig}
          className={`px-8 py-3.5 rounded-lg text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 ${
            isValidConfig
              ? 'bg-[#4F46E5] dark:bg-[#6366F1] hover:bg-[#4338CA] dark:hover:bg-[#818CF8] hover:scale-105 shadow-[#4F46E5]/20'
              : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          <span>Start Session</span>
          <Play className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Step 1. Select Game Mode */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-[#151827] dark:text-[#F8FAFC] flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#4F46E5] dark:bg-[#6366F1] text-white text-xs font-black flex items-center justify-center">1</span>
          <span>Select Game Mode</span>
        </h2>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {gameModes.map(g => {
            const Icon = g.icon;
            const isSelected = selectedMode === g.id;

            return (
              <button
                key={g.id}
                onClick={() => onSelectMode(g.id)}
                className={`p-4 rounded-xl transition-all text-left flex flex-col justify-between h-[115px] relative ${
                  isSelected
                    ? 'bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.08)] border-2 border-[#4F46E5] dark:border-[#6366F1] text-[#151827] dark:text-[#F8FAFC]'
                    : 'bg-white dark:bg-[#111522] border border-[#D9DDF0] dark:border-[#252B40] text-[#475069] dark:text-[#A8B0C2] hover:border-[#B8BDE0] dark:hover:border-[#343B58] hover:text-[#151827] dark:hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white' : 'bg-[#F4F5FF] dark:bg-[#0D1120] border border-[#D9DDF0] dark:border-[#252B40] text-[#475069] dark:text-[#A8B0C2]'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#4F46E5] dark:bg-[#6366F1] text-white flex items-center justify-center animate-scaleIn">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-[#151827] dark:text-[#F8FAFC]">
                    {g.title}
                  </h3>
                  <div className="text-[10px] font-bold text-[#4F46E5] dark:text-[#818CF8]">
                    {g.category}
                  </div>
                  <p className="text-xs text-[#475069] dark:text-[#A8B0C2] mt-0.5 line-clamp-1">
                    {g.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2. Select Character Rows */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#151827] dark:text-[#F8FAFC] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#4F46E5] dark:bg-[#6366F1] text-white text-xs font-black flex items-center justify-center">2</span>
            <span>Select Character Rows ({selectedRowIds.length} Rows Selected)</span>
          </h2>

          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={onSelectAllRows}
              className="text-[#4F46E5] dark:text-[#818CF8] hover:underline"
            >
              Select All
            </button>
            <span className="text-[#69738A] dark:text-[#343B58]">|</span>
            <button
              onClick={onClearAllRows}
              className="text-[#69738A] dark:text-[#737D94] hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {HIRAGANA_ROWS.map(row => {
            const isSelected = selectedRowIds.includes(row.id);

            return (
              <button
                key={row.id}
                onClick={() => onToggleRow(row.id)}
                className={`p-4 rounded-xl transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#EEF2FF] dark:bg-[rgba(99,102,241,0.08)] border-2 border-[#4F46E5] dark:border-[#6366F1] text-[#151827] dark:text-[#F8FAFC]'
                    : 'bg-white dark:bg-[#111522] border border-[#D9DDF0] dark:border-[#252B40] text-[#475069] dark:text-[#A8B0C2] hover:border-[#B8BDE0] dark:hover:border-[#343B58]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#69738A] dark:text-[#737D94]">ROW {row.name}</span>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#4F46E5] dark:bg-[#6366F1] border-[#4F46E5] dark:border-[#6366F1] text-white' : 'border-[#D9DDF0] dark:border-[#343B58] bg-white dark:bg-[#0D1120]'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="text-xl font-bold text-[#151827] dark:text-[#F8FAFC]" style={{ fontFamily: FONT_DESCRIPTIONS[currentFont].title }}>
                  {row.label}
                </div>

                <div className="text-xs font-mono text-[#69738A] dark:text-[#737D94] mt-1">
                  {row.characters.map(c => c.romanization).join('  ')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3 & 4. Question Count & Font Style Segmented Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Step 3. Question Count Segmented Control */}
        {isQuestionBasedGame ? (
          <div className="bg-white dark:bg-[#111522] p-5 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] space-y-3 shadow-xs">
            <div className="text-xs font-extrabold text-[#151827] dark:text-[#F8FAFC] uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#4F46E5] dark:bg-[#6366F1] text-white text-[10px] font-black flex items-center justify-center">3</span>
                <span>Question Count</span>
              </div>
              <span className="text-[#4F46E5] dark:text-[#818CF8]">{questionCount} Qs</span>
            </div>
            <div className="grid grid-cols-4 gap-2 bg-[#F4F5FF] dark:bg-[#0D1120] p-1.5 rounded-xl border border-[#D9DDF0] dark:border-[#252B40]">
              {countOptions.map(cnt => (
                <button
                  key={cnt}
                  onClick={() => onSelectQuestionCount(cnt)}
                  className={`py-2 rounded-lg text-xs font-extrabold transition-all ${
                    questionCount === cnt
                      ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white shadow-xs'
                      : 'text-[#475069] dark:text-[#A8B0C2] hover:text-[#151827] dark:hover:text-white'
                  }`}
                >
                  {cnt} Qs
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#69738A] dark:text-[#737D94]">
              Choose how many active recall questions you want in this practice set.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111522] p-5 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] space-y-2 flex flex-col justify-center shadow-xs">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#4F46E5] dark:text-[#818CF8]">
              STEP 3. GAME CONFIGURATION
            </div>
            <h4 className="text-sm font-extrabold text-[#151827] dark:text-[#F8FAFC]">
              {gameModes.find(g => g.id === selectedMode)?.title} Mode
            </h4>
            <p className="text-xs text-[#475069] dark:text-[#A8B0C2]">
              Deck size and targets are automatically generated from your selected character rows ({selectedRowIds.length} rows active).
            </p>
          </div>
        )}

        {/* Step 4. Font Style Segmented Control with Live Preview */}
        <div className="bg-white dark:bg-[#111522] p-5 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] space-y-3 shadow-xs">
          <div className="text-xs font-extrabold text-[#151827] dark:text-[#F8FAFC] uppercase tracking-wider flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#4F46E5] dark:bg-[#6366F1] text-white text-[10px] font-black flex items-center justify-center">4</span>
              <Type className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#6366F1]" />
              <span>Practice Font Style</span>
            </div>
            {/* Live Japanese Font Preview */}
            <span className={`text-base font-bold text-[#4F46E5] dark:text-[#818CF8] ${FONT_CLASSES[currentFont]}`}>
              あいうえお
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 bg-[#F4F5FF] dark:bg-[#0D1120] p-1.5 rounded-xl border border-[#D9DDF0] dark:border-[#252B40]">
            {fontOptions.map(f => (
              <button
                key={f}
                onClick={() => onSelectFont(f)}
                className={`py-2 rounded-lg text-xs font-extrabold transition-all capitalize ${
                  currentFont === f
                    ? 'bg-[#4F46E5] dark:bg-[#6366F1] text-white shadow-xs'
                    : 'text-[#475069] dark:text-[#A8B0C2] hover:text-[#151827] dark:hover:text-white'
                }`}
              >
                {FONT_DESCRIPTIONS[f].title}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Step 5. Ready Banner & Start Session */}
      <div className="bg-white dark:bg-[#111522] p-6 sm:p-8 rounded-2xl border border-[#D9DDF0] dark:border-[#252B40] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors duration-200">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-[#4F46E5] dark:text-[#818CF8]">
            {isValidConfig ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#6366F1]" />
                <span>STEP 5. READY TO PRACTICE</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-[#B42318] dark:text-[#EF4444]" />
                <span>SELECT AT LEAST 1 CHARACTER ROW</span>
              </>
            )}
          </div>
          <h3 className="text-xl font-black text-[#151827] dark:text-[#F8FAFC] mt-1">
            Ready to Start {gameModes.find(g => g.id === selectedMode)?.title}?
          </h3>
          <p className="text-xs text-[#475069] dark:text-[#A8B0C2] mt-1">
            {selectedRowIds.length} Character Rows Selected · {currentFont.toUpperCase()} Font Style
          </p>
        </div>

        <button
          onClick={onStartPractice}
          disabled={!isValidConfig}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-lg font-black text-sm shadow-md transition-all flex items-center justify-center gap-2.5 shrink-0 ${
            isValidConfig
              ? 'bg-[#4F46E5] dark:bg-[#6366F1] hover:bg-[#4338CA] dark:hover:bg-[#818CF8] text-white shadow-[#4F46E5]/20 hover:scale-105 active:scale-95'
              : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          <span>Start Practice Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
