import { useState, useCallback, useRef } from 'react';

// Mapping from Romanization to Japanese Hiragana Character
const ROMAN_TO_HIRAGANA: Record<string, string> = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  sa: 'さ', shi: 'し', su: 'す', se: 'せ', so: 'そ',
  ta: 'た', chi: 'ち', tsu: 'つ', te: 'て', to: 'と',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', fu: 'ふ', he: 'へ', ho: 'ほ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'mo',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を', n: 'ん'
};

export function useAudio(enabled: boolean) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const audioCacheRef = useRef<Record<string, HTMLAudioElement>>({});

  const speakText = useCallback((text: string, customSpeed?: number) => {
    if (!enabled || !text) return;

    const activeSpeed = customSpeed || playbackSpeed;
    const lowerText = text.trim().toLowerCase();
    const japaneseChar = ROMAN_TO_HIRAGANA[lowerText] || text;

    setIsPlaying(true);
    setPlayingText(text);

    const handleStop = () => {
      setIsPlaying(false);
      setPlayingText(null);
    };

    // 1. Primary Engine: Instant Web Speech API with explicit Japanese locale voice & rate speed
    // This is 100% hardware-accelerated, zero network latency, pitch-preserved smooth audio up to 3x!
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Cancel any lingering utterances instantly

        const utterance = new SpeechSynthesisUtterance(japaneseChar);
        utterance.lang = 'ja-JP';
        utterance.rate = Math.min(Math.max(activeSpeed, 0.5), 3.0); // Clamp speed between 0.5x and 3.0x

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

        // Safety timeout scaled to active speed
        const timeoutMs = Math.max(400, Math.round(1200 / activeSpeed));
        setTimeout(handleStop, timeoutMs);
        return;
      } catch (e) {}
    }

    // 2. Secondary Engine: Cached Audio Stream
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(japaneseChar)}&le=jap`;
    let audio = audioCacheRef.current[japaneseChar];
    if (!audio) {
      audio = new Audio(audioUrl);
      audioCacheRef.current[japaneseChar] = audio;
    }

    audio.currentTime = 0;
    audio.playbackRate = activeSpeed;
    audio.onended = handleStop;
    audio.onerror = handleStop;
    audio.play().catch(handleStop);

  }, [enabled, playbackSpeed]);

  return {
    speakText,
    isPlaying,
    playingText,
    playbackSpeed,
    setPlaybackSpeed
  };
}
