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
  Volume2,
  Lightbulb,
  ExternalLink,
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
  onPlayAudio?: (text: string) => void;
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
  onPlayAudio,
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

  const handlePlayRowAudio = (e: React.MouseEvent, chars: string[]) => {
    e.stopPropagation();
    if (onPlayAudio && chars.length > 0) {
      onPlayAudio(chars[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 animate-pageTransition">
      
      {/* Section Header Banner */}
      <div className="bg-[#FFFDF8] p-6 sm:p-8 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#66765B] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRACTICE SESSION STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#30312F] mt-1">
            Configure Practice Session
          </h1>
          <p className="text-xs text-[#6F716C] mt-1">
            Follow steps 1–5 to customize your active recall practice.
          </p>
        </div>

        <button
          onClick={onStartPractice}
          disabled={!isValidConfig}
          className={`btn-coral-cta px-8 py-3.5 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 ${
            !isValidConfig ? 'bg-[#E8E4DA] text-[#96978F] cursor-not-allowed opacity-50 shadow-none' : ''
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Practice Session</span>
        </button>
      </div>

      {/* Step 1. Select Game Mode */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-[#30312F] flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#8B9B7A] text-[#FFFDF8] text-xs font-black flex items-center justify-center">1</span>
          <span>Select Game Mode</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {gameModes.map(g => {
            const Icon = g.icon;
            const isSelected = selectedMode === g.id;

            return (
              <button
                key={g.id}
                onClick={() => onSelectMode(g.id)}
                className={`p-4 rounded-2xl transition-all text-left flex flex-col justify-between h-[115px] relative ${
                  isSelected
                    ? 'bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#30312F]'
                    : 'bg-[#FFFDF8] border border-[#E6E0D4] text-[#6F716C] hover:bg-[#FEFCF7] hover:border-[#B7C4AA] hover:text-[#30312F]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[#66765B] text-[#FFFDF8]' : 'bg-[#F4F1E9] border border-[#DDD7CB] text-[#66765B]'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#66765B] text-[#FFFDF8] flex items-center justify-center animate-scaleIn">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-[#30312F]">
                    {g.title}
                  </h3>
                  <div className="text-[10px] font-bold text-[#66765B]">
                    {g.category}
                  </div>
                  <p className="text-xs text-[#6F716C] mt-0.5 line-clamp-1">
                    {g.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2. Select Character Rows with Section Badges */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-extrabold text-[#30312F] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#8B9B7A] text-[#FFFDF8] text-xs font-black flex items-center justify-center">2</span>
            <span>Select Character Rows ({selectedRowIds.length} Rows Selected)</span>
          </h2>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <button
              onClick={onSelectAllRows}
              className="px-2.5 py-1 rounded-lg bg-[#F4F1E9] border border-[#DDD7CB] text-[#30312F] hover:border-[#8B9B7A] transition-all"
            >
              All Rows (16)
            </button>
            <button
              onClick={() => {
                onClearAllRows();
                ['A', 'K', 'S', 'T', 'N', 'H', 'M', 'Y', 'R', 'W', 'N_SOLO'].forEach(id => onToggleRow(id));
              }}
              className="px-2.5 py-1 rounded-lg bg-[#F4F1E9] border border-[#DDD7CB] text-[#30312F] hover:border-[#8B9B7A] transition-all"
            >
              Basic (11)
            </button>
            <button
              onClick={() => {
                onClearAllRows();
                ['G', 'Z', 'D', 'B'].forEach(id => onToggleRow(id));
              }}
              className="px-2.5 py-1 rounded-lg bg-[#E5EBDD] border border-[#CCD6C2] text-[#66765B] font-black hover:scale-105 transition-all"
            >
              + Dakuon ゛ (4)
            </button>
            <button
              onClick={() => {
                onClearAllRows();
                ['P'].forEach(id => onToggleRow(id));
              }}
              className="px-2.5 py-1 rounded-lg bg-[#E5EBDD] border border-[#CCD6C2] text-[#66765B] font-black hover:scale-105 transition-all"
            >
              + Handakuten ゜ (1)
            </button>
            <button
              onClick={onClearAllRows}
              className="px-2 py-1 text-[#96978F] hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Section 1: Basic Gojūon */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E5EBDD] text-[#66765B] text-xs font-black uppercase tracking-wider border border-[#CCD6C2]">
                  BASIC HIRAGANA (GOJŪON · 清音)
                </span>
                <span className="text-xs text-[#6F716C]">11 Sets · 46 Kana</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {HIRAGANA_ROWS.filter(r => ['A','K','S','T','N','H','M','Y','R','W','N_SOLO'].includes(r.id)).map(row => {
                const isSelected = selectedRowIds.includes(row.id);
                return (
                  <div
                    key={row.id}
                    onClick={() => onToggleRow(row.id)}
                    className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[140px] cursor-pointer group shadow-[0_4px_18px_rgba(48,49,47,0.06)] relative ${
                      isSelected
                        ? 'bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#30312F]'
                        : 'bg-[#FFFDF8] border border-[#E6E0D4] text-[#6F716C] hover:border-[#B7C4AA] hover:bg-[#FEFCF7]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#66765B]">ROW {row.name}</span>
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#66765B] border-[#66765B] text-[#FFFDF8]' : 'border-[#DDD7CB] bg-[#FFFDF8]'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="text-2xl font-black text-[#30312F] tracking-wide my-1" style={{ fontFamily: FONT_DESCRIPTIONS[currentFont].title }}>
                      {row.characters.map(c => c.character).join(' ')}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E6E0D4]/60">
                      <span className="text-xs font-mono text-[#6F716C]">
                        {row.characters.map(c => c.romanization).join('  ')}
                      </span>

                      {/* Circular Speaker Audio Button */}
                      <button
                        onClick={(e) => handlePlayRowAudio(e, row.characters.map(c => c.character))}
                        className="w-9 h-9 rounded-full bg-[#F4F1E9] hover:bg-[#E5EBDD] text-[#66765B] flex items-center justify-center border border-[#DDD7CB] transition-colors"
                        title="Listen to Row Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Dakuon (Voiced Sounds ゛) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E5EBDD] text-[#66765B] text-xs font-black uppercase tracking-wider border border-[#CCD6C2]">
                  DAKUON (VOICED SOUNDS ゛ · 一濁音)
                </span>
                <span className="text-xs text-[#6F716C]">4 Sets · 20 Kana (G, Z, D, B)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {HIRAGANA_ROWS.filter(r => ['G','Z','D','B'].includes(r.id)).map(row => {
                const isSelected = selectedRowIds.includes(row.id);
                return (
                  <div
                    key={row.id}
                    onClick={() => onToggleRow(row.id)}
                    className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[140px] cursor-pointer group shadow-[0_4px_18px_rgba(48,49,47,0.06)] relative ${
                      isSelected
                        ? 'bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#30312F]'
                        : 'bg-[#FFFDF8] border border-[#E6E0D4] text-[#6F716C] hover:border-[#B7C4AA] hover:bg-[#FEFCF7]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#66765B]">ROW {row.name} (゛)</span>
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#66765B] border-[#66765B] text-[#FFFDF8]' : 'border-[#DDD7CB] bg-[#FFFDF8]'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="text-2xl font-black text-[#30312F] tracking-wide my-1" style={{ fontFamily: FONT_DESCRIPTIONS[currentFont].title }}>
                      {row.characters.map(c => c.character).join(' ')}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E6E0D4]/60">
                      <span className="text-xs font-mono text-[#6F716C]">
                        {row.characters.map(c => c.romanization).join('  ')}
                      </span>

                      <button
                        onClick={(e) => handlePlayRowAudio(e, row.characters.map(c => c.character))}
                        className="w-9 h-9 rounded-full bg-[#F4F1E9] hover:bg-[#E5EBDD] text-[#66765B] flex items-center justify-center border border-[#DDD7CB] transition-colors"
                        title="Listen to Row Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Handakuten (Semi-Voiced Sounds ゜) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E5EBDD] text-[#66765B] text-xs font-black uppercase tracking-wider border border-[#CCD6C2]">
                  HANDAKUTEN (SEMI-VOICED SOUNDS ゜ · 半濁音)
                </span>
                <span className="text-xs text-[#6F716C]">1 Set · 5 Kana (P)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {HIRAGANA_ROWS.filter(r => ['P'].includes(r.id)).map(row => {
                const isSelected = selectedRowIds.includes(row.id);
                return (
                  <div
                    key={row.id}
                    onClick={() => onToggleRow(row.id)}
                    className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[140px] cursor-pointer group shadow-[0_4px_18px_rgba(48,49,47,0.06)] relative ${
                      isSelected
                        ? 'bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#30312F]'
                        : 'bg-[#FFFDF8] border border-[#E6E0D4] text-[#6F716C] hover:border-[#B7C4AA] hover:bg-[#FEFCF7]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#66765B]">ROW {row.name} (゜)</span>
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#66765B] border-[#66765B] text-[#FFFDF8]' : 'border-[#DDD7CB] bg-[#FFFDF8]'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="text-2xl font-black text-[#30312F] tracking-wide my-1" style={{ fontFamily: FONT_DESCRIPTIONS[currentFont].title }}>
                      {row.characters.map(c => c.character).join(' ')}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E6E0D4]/60">
                      <span className="text-xs font-mono text-[#6F716C]">
                        {row.characters.map(c => c.romanization).join('  ')}
                      </span>

                      <button
                        onClick={(e) => handlePlayRowAudio(e, row.characters.map(c => c.character))}
                        className="w-9 h-9 rounded-full bg-[#F4F1E9] hover:bg-[#E5EBDD] text-[#66765B] flex items-center justify-center border border-[#DDD7CB] transition-colors"
                        title="Listen to Row Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Step 3 & 4. Question Count & Font Style Segmented Controls (Reference Screenshot Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Step 3: Question Count Segmented Control */}
        {isQuestionBasedGame ? (
          <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#E6E0D4] space-y-3 shadow-[0_4px_18px_rgba(48,49,47,0.06)]">
            <div className="text-xs font-extrabold text-[#30312F] uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#8B9B7A] text-[#FFFDF8] text-[10px] font-black flex items-center justify-center">3</span>
                <span>QUESTION COUNT</span>
              </div>
              <span className="text-[#66765B] font-black">{questionCount} Qs</span>
            </div>
            <div className="grid grid-cols-4 gap-2 bg-[#F5F1E9] p-1.5 rounded-xl border border-[#DDD7CB]">
              {countOptions.map(cnt => (
                <button
                  key={cnt}
                  onClick={() => onSelectQuestionCount(cnt)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    questionCount === cnt
                      ? 'bg-[#66765B] text-[#FFFDF8] shadow-xs font-black'
                      : 'text-[#6F716C] hover:text-[#30312F]'
                  }`}
                >
                  {cnt} Qs
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#6F716C]">
              Choose how many active recall questions you want in this practice set.
            </p>
          </div>
        ) : (
          <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#E6E0D4] space-y-2 flex flex-col justify-center shadow-[0_4px_18px_rgba(48,49,47,0.06)]">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#66765B]">
              STEP 3. GAME CONFIGURATION
            </div>
            <h4 className="text-sm font-extrabold text-[#30312F]">
              {gameModes.find(g => g.id === selectedMode)?.title} Mode
            </h4>
            <p className="text-xs text-[#6F716C]">
              Deck size and targets are automatically generated from your selected character rows ({selectedRowIds.length} rows active).
            </p>
          </div>
        )}

        {/* Step 4: Font Style Segmented Control */}
        <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#E6E0D4] space-y-3 shadow-[0_4px_18px_rgba(48,49,47,0.06)]">
          <div className="text-xs font-extrabold text-[#30312F] uppercase tracking-wider flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#8B9B7A] text-[#FFFDF8] text-[10px] font-black flex items-center justify-center">4</span>
              <span>PRACTICE FONT STYLE</span>
            </div>
            <span className={`text-base font-bold text-[#66765B] ${FONT_CLASSES[currentFont]}`}>
              あいうえお
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 bg-[#F5F1E9] p-1.5 rounded-xl border border-[#DDD7CB]">
            {fontOptions.map(f => (
              <button
                key={f}
                onClick={() => onSelectFont(f)}
                className={`py-2 rounded-lg text-xs font-bold transition-all capitalize ${
                  currentFont === f
                    ? 'bg-[#66765B] text-[#FFFDF8] shadow-xs font-black'
                    : 'text-[#6F716C] hover:text-[#30312F]'
                }`}
              >
                {FONT_DESCRIPTIONS[f].title}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#6F716C]">
            Select the font style used in practice questions.
          </p>
        </div>

      </div>

      {/* Step 5. Bottom Action Panel (Matches Reference Screenshot) */}
      <div className="bg-[#FFFDF8] p-6 sm:p-8 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors duration-200">
        <div>
          <h3 className="text-lg font-extrabold text-[#30312F]">
            Ready to start your practice session?
          </h3>
          <p className="text-xs text-[#6F716C] mt-1">
            Review your settings and begin active recall practice.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              if (gameModes.length > 0) {
                onSelectMode('read-it');
              }
            }}
            className="w-full sm:w-auto btn-sage-secondary px-6 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-[#66765B]" />
            <span>Back to Practice Modes</span>
          </button>

          <button
            onClick={onStartPractice}
            disabled={!isValidConfig}
            className={`w-full sm:w-auto btn-coral-cta px-8 py-3.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2.5 shrink-0 ${
              !isValidConfig ? 'bg-[#E8E4DA] text-[#96978F] cursor-not-allowed opacity-50 shadow-none' : ''
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Practice Session</span>
          </button>
        </div>
      </div>

      {/* Tip Bar (Matches Reference Screenshot) */}
      <div className="bg-[#F0F2E8] border border-[#D8DDCC] p-4 rounded-xl flex items-center gap-3 text-xs shadow-xs text-[#4F514C]">
        <div className="w-7 h-7 rounded-lg bg-[#E5EBDD] text-[#66765B] flex items-center justify-center shrink-0 border border-[#CCD6C2]">
          <Lightbulb className="w-4 h-4 text-[#66765B]" />
        </div>

        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="font-extrabold px-2 py-0.5 rounded bg-[#E5EBDD] text-[#66765B] text-[10px] uppercase w-fit border border-[#CCD6C2]">
            TIP
          </span>
          <span>
            Active recall helps you remember better. Take your time and try to recall the kana before checking!
          </span>
        </div>
      </div>

    </div>
  );
};
