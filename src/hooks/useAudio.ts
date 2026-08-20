import { useState, useCallback, useRef } from 'react';

// Mapping from Romanization to Japanese Hiragana Character
const ROMAN_TO_HIRAGANA: Record<string, string> = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  sa: 'さ', shi: 'し', su: 'す', se: 'せ', so: 'そ',
  ta: 'た', chi: 'ち', tsu: 'つ', te: 'て', to: 'と',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', fu: 'ふ', he: 'へ', ho: 'ほ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を', n: 'ん'
};

export function useAudio(enabled: boolean) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85); // Default 0.85x
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const speakText = useCallback((text: string, customSpeed?: number) => {
    if (!enabled || !text) return;

    const activeSpeed = customSpeed || playbackSpeed;

    // Convert Romanization ('i', 'ka') to true Japanese Hiragana character ('い', 'か')
    const lowerText = text.trim().toLowerCase();
    const japaneseChar = ROMAN_TO_HIRAGANA[lowerText] || text;

    // Stop any active playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(true);
    setPlayingText(text);

    const handleStop = () => {
      setIsPlaying(false);
      setPlayingText(null);
    };

    // 1. Direct Japanese Spoken Audio Stream with dynamic playbackRate speed
    const encodedText = encodeURIComponent(japaneseChar);
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodedText}&le=jap`;
    const audio = new Audio(audioUrl);
    audio.playbackRate = activeSpeed;
    currentAudioRef.current = audio;

    audio.onended = handleStop;
    audio.onerror = () => {
      // 2. Web Speech API with explicit Japanese voice & rate speed
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(japaneseChar);
        utterance.lang = 'ja-JP';
        utterance.rate = activeSpeed;

        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find(v => 
          v.lang.includes('ja') || 
          v.lang.includes('JP') || 
          v.name.toLowerCase().includes('japanese') || 
          v.name.includes('Haruka') || 
          v.name.includes('Kyoko') || 
          v.name.includes('Ayumi')
        );
        if (jaVoice) {
          utterance.voice = jaVoice;
        }

        utterance.onend = handleStop;
        utterance.onerror = handleStop;

        window.speechSynthesis.speak(utterance);
      } else {
        handleStop();
      }
    };

    audio.play().catch(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(japaneseChar);
        utterance.lang = 'ja-JP';
        utterance.rate = activeSpeed;

        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find(v => 
          v.lang.includes('ja') || 
          v.lang.includes('JP') || 
          v.name.toLowerCase().includes('japanese') || 
          v.name.includes('Haruka') || 
          v.name.includes('Kyoko') || 
          v.name.includes('Ayumi')
        );
        if (jaVoice) {
          utterance.voice = jaVoice;
        }

        utterance.onend = handleStop;
        utterance.onerror = handleStop;

        window.speechSynthesis.speak(utterance);
      } else {
        handleStop();
      }
    });

    const timeoutDuration = Math.max(1200, Math.round(1800 / activeSpeed));
    setTimeout(() => {
      setIsPlaying(false);
      setPlayingText(null);
    }, timeoutDuration);

  }, [enabled, playbackSpeed]);

  return {
    speakText,
    isPlaying,
    playingText,
    playbackSpeed,
    setPlaybackSpeed
  };
}
