import React from 'react';
import { X, Check } from 'lucide-react';
import { FontStyle, FontMode } from '../../types';
import { FONT_CLASSES, FONT_DESCRIPTIONS } from '../../hooks/useFont';

interface FontSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentFont: FontStyle;
  onSelectFont: (font: FontStyle) => void;
  fontMode?: FontMode;
  onSelectFontMode?: (mode: FontMode) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  isOpen,
  onClose,
  currentFont,
  onSelectFont,
}) => {
  if (!isOpen) return null;

  const fontKeys: FontStyle[] = ['kyokasho', 'mincho', 'gothic'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-pageTransition">
      <div className="bg-[#FFFDF8] border border-[#E6E0D4] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 text-[#30312F] relative">
        
        <div className="flex items-center justify-between border-b border-[#E6E0D4] pb-3">
          <div>
            <h3 className="text-lg font-black text-[#30312F]">Japanese Font Style</h3>
            <p className="text-xs text-[#6F716C]">Choose how Hiragana characters are rendered</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F4F1E9] hover:bg-[#F0EEE6] text-[#6F716C] hover:text-[#30312F] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {fontKeys.map((fontKey) => {
            const fontInfo = FONT_DESCRIPTIONS[fontKey];
            const isSelected = currentFont === fontKey;

            return (
              <button
                key={fontKey}
                onClick={() => {
                  onSelectFont(fontKey);
                  onClose();
                }}
                className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#F1F5ED] border-2 border-[#8B9B7A] text-[#30312F]'
                    : 'bg-[#FFFDF8] border-[#E6E0D4] hover:border-[#B7C4AA] hover:bg-[#FEFCF7]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-[#30312F]">{fontInfo.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5EBDD] text-[#66765B]">
                      {fontInfo.jpName}
                    </span>
                  </div>
                  <p className="text-xs text-[#6F716C]">{fontInfo.desc}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-3xl font-bold ${FONT_CLASSES[fontKey]}`}>あ</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#8B9B7A] text-[#FFFDF8] flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
