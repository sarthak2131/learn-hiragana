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

function pickJapaneseVoice(voices: SpeechSynthesisVoice[]) {
  return voices.find((voice) => {
    const name = voice.name.toLowerCase();
    const lang = voice.lang.toLowerCase();

    return (
      lang.startsWith('ja') ||
      lang.includes('jp') ||
      name.includes('japanese') ||
      name.includes('haruka') ||
      name.includes('kyoko') ||
      name.includes('ayumi') ||
      name.includes('sakura')
    );
  }) ?? null;
}

export function useAudio(enabled: boolean) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const audioCacheRef = useRef<Record<string, HTMLAudioElement>>({});
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playbackIdRef = useRef<number>(0);
  const resolvePlaybackRef = useRef<(() => void) | null>(null);
  const voicesPromiseRef = useRef<Promise<SpeechSynthesisVoice[]> | null>(null);

  const clearPlaybackState = useCallback((resolveCurrent: boolean) => {
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {}
      currentAudioRef.current = null;
    }

    setIsPlaying(false);
    setPlayingText(null);

    if (resolveCurrent && resolvePlaybackRef.current) {
      const resolve = resolvePlaybackRef.current;
      resolvePlaybackRef.current = null;
      resolve();
    }
  }, []);

  const stopAudio = useCallback(() => {
    playbackIdRef.current += 1;
    clearPlaybackState(true);
  }, [clearPlaybackState]);

  const loadVoices = useCallback(async (): Promise<SpeechSynthesisVoice[]> => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return [];
    }

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    if (voices.length > 0) {
      return voices;
    }

    if (!voicesPromiseRef.current) {
      voicesPromiseRef.current = new Promise<SpeechSynthesisVoice[]>((resolve) => {
        const timeout = setTimeout(() => {
          voicesPromiseRef.current = null;
          resolve(synth.getVoices());
        }, 250);

        const handleVoicesChanged = () => {
          clearTimeout(timeout);
          voicesPromiseRef.current = null;
          synth.removeEventListener('voiceschanged', handleVoicesChanged);
          resolve(synth.getVoices());
        };

        synth.addEventListener('voiceschanged', handleVoicesChanged, { once: true });
      });
    }

    return voicesPromiseRef.current;
  }, []);

  const speakText = useCallback(async (text: string, customSpeed?: number) => {
    stopAudio();

    if (!enabled || !text) return;

    const playbackId = ++playbackIdRef.current;
    const activeSpeed = customSpeed || playbackSpeed;
    const lowerText = text.trim().toLowerCase();
    const japaneseChar = ROMAN_TO_HIRAGANA[lowerText] || text;

    setIsPlaying(true);
    setPlayingText(text);

    const finishIfCurrent = () => {
      if (playbackId !== playbackIdRef.current) return;
      clearPlaybackState(true);
    };

    const voices = await loadVoices();
    if (playbackId !== playbackIdRef.current) return;

    const preferredVoice = pickJapaneseVoice(voices);

    // Prefer a real Japanese voice when available. If the browser does not
    // expose one, fall back to the remote pronunciation audio so the sound
    // stays natural instead of using a broken default voice.
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && preferredVoice) {
      try {
        await new Promise<void>((resolve) => {
          resolvePlaybackRef.current = resolve;

          const utterance = new SpeechSynthesisUtterance(japaneseChar);
          utterance.lang = 'ja-JP';
          utterance.rate = Math.min(Math.max(activeSpeed, 0.65), 2.0);
          utterance.voice = preferredVoice;

          utterance.onend = finishIfCurrent;
          utterance.onerror = finishIfCurrent;

          window.speechSynthesis.speak(utterance);

          safetyTimeoutRef.current = setTimeout(
            finishIfCurrent,
            Math.max(700, Math.round(1800 / activeSpeed))
          );
        });
        return;
      } catch (e) {
        // Fall through to the remote audio path.
      }
    }

    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(japaneseChar)}&le=jap`;
    let audio = audioCacheRef.current[japaneseChar];
    if (!audio) {
      audio = new Audio(audioUrl);
      audioCacheRef.current[japaneseChar] = audio;
    }

    if (playbackId !== playbackIdRef.current) return;

    currentAudioRef.current = audio;
    audio.currentTime = 0;
    audio.playbackRate = activeSpeed;

    await new Promise<void>((resolve) => {
      resolvePlaybackRef.current = resolve;
      audio.onended = finishIfCurrent;
      audio.onerror = finishIfCurrent;
      audio.play().catch(finishIfCurrent);
    });
  }, [enabled, loadVoices, playbackSpeed, stopAudio, clearPlaybackState]);

  return {
    speakText,
    stopAudio,
    isPlaying,
    playingText,
    playbackSpeed,
    setPlaybackSpeed
  };
}
