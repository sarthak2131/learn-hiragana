import type { FontStyle, HiraganaCharacter } from '../types';
import { HIRAGANA_ROWS } from '../data/hiraganaData';
import { Volume2, Edit3, Sparkles } from 'lucide-react';

interface WritingPageProps {
  activeFont: FontStyle;
  onPlayAudio: (text: string) => void;
  onStartWritingPractice: (character: HiraganaCharacter) => void;
}

const fontFamilies: Record<FontStyle, string> = {
  kyokasho: '"Klee One", "Noto Sans JP", sans-serif',
  mincho: '"Shippori Mincho", serif',
  gothic: '"Zen Maru Gothic", sans-serif',
};

export function WritingPage({ activeFont, onPlayAudio, onStartWritingPractice }: WritingPageProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 animate-pageTransition">
      
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] p-6 sm:p-8 rounded-2xl border border-[#E6E0D4] shadow-[0_4px_18px_rgba(48,49,47,0.06)] transition-colors duration-200">
        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#66765B] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HANDWRITING STUDIO</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#30312F] mt-1">
          Writing Practice & Shape Memory
        </h2>
        <p className="text-xs text-[#6F716C] mt-1">
          Tap any Hiragana character to launch interactive handwriting canvas practice with live stroke feedback.
        </p>
      </div>

      {/* Grid of Printable Character Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HIRAGANA_ROWS.flatMap((row) => row.characters).map((char) => (
          <button
            key={char.id}
            onClick={() => onStartWritingPractice(char)}
            className="rounded-2xl bg-[#FFFDF8] border border-[#E6E0D4] hover:border-[#B7C4AA] p-5 text-left shadow-[0_4px_18px_rgba(48,49,47,0.06)] hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-[#96978F]">
                  "{char.romanization}"
                </div>
                <div className="mt-2 text-5xl font-black text-[#30312F] group-hover:text-[#66765B] transition-colors" style={{ fontFamily: fontFamilies[activeFont] }}>
                  {char.character}
                </div>
              </div>
              
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onPlayAudio(char.character);
                }}
                className="p-2.5 rounded-xl bg-[#E5EBDD] text-[#66765B] hover:bg-[#DCE4D4] transition-colors"
                title="Play Audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E6E0D4] flex items-center justify-between text-xs font-bold text-[#66765B]">
              <span className="flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Draw Canvas</span>
              </span>
              <span>Start →</span>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}
