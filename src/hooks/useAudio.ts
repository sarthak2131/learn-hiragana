import { useState, useCallback, useRef, useEffect } from 'react';

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
  wa: 'わ', wo: 'を', n: 'ん',
  
  // Dakuon (゛)
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  za: 'ざ', ji: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  da: 'だ', dji: 'ぢ', dzu: 'づ', de: 'で', do: 'ど',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',

  // Handakuten (゜)
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ'
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
      name.includes('sakura') ||
      name.includes('nanami') ||
      name.includes('keita') ||
      name.includes('naoki') ||
      name.includes('hina') ||
      (name.includes('google') && (lang.includes('ja') || name.includes('日本語')))
    );
  }) ?? null;
}

// Fallback Web Audio API chime for offline / missing audio
function playWebAudioTone() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
}

export function useAudio(enabled: boolean) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const audioCacheRef = useRef<Record<string, HTMLAudioElement>>({});
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const playbackIdRef = useRef<number>(0);
  const lastPlayRef = useRef<{ text: string; time: number }>({ text: '', time: 0 });
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Pre-load Web Speech voices on mount so there is zero delay when invoked
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      try {
        voicesRef.current = window.speechSynthesis.getVoices();
      } catch (e) {}
    };

    updateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const clearPlaybackState = useCallback(() => {
    // 1. Instantly cancel any ongoing or queued Web Speech Synthesis utterances
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    // 2. Pause and reset current HTML5 audio element
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {}
      currentAudioRef.current = null;
    }

    setIsPlaying(false);
    setPlayingText(null);
  }, []);

  const stopAudio = useCallback(() => {
    playbackIdRef.current += 1;
    clearPlaybackState();
  }, [clearPlaybackState]);

  const speakText = useCallback(async (text: string, customSpeed?: number) => {
    if (!enabled || !text) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    // Prevent rapid duplicate trigger for same text within 120ms (prevents double audio echo)
    const now = Date.now();
    if (lastPlayRef.current.text === trimmed && (now - lastPlayRef.current.time) < 120) {
      return;
    }
    lastPlayRef.current = { text: trimmed, time: now };

    // Stop all previous audio & cancel any queued speech synthesis immediately
    stopAudio();

    const playbackId = ++playbackIdRef.current;
    const activeSpeed = customSpeed || playbackSpeed;
    const lowerText = trimmed.toLowerCase();
    const japaneseChar = ROMAN_TO_HIRAGANA[lowerText] || trimmed;

    setIsPlaying(true);
    setPlayingText(trimmed);

    const finishIfCurrent = () => {
      if (playbackId === playbackIdRef.current) {
        setIsPlaying(false);
        setPlayingText(null);
      }
    };

    // 1. Primary Ultra-Fast Audio: Pre-cached HTML5 Audio (Zero delay, instant playback)
    const primaryUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(japaneseChar)}&tl=ja&client=tw-ob`;
    const secondaryUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(japaneseChar)}&le=jap`;

    let audio = audioCacheRef.current[japaneseChar];
    if (!audio) {
      audio = new Audio(primaryUrl);
      audio.preload = 'auto';
      audioCacheRef.current[japaneseChar] = audio;
    }

    currentAudioRef.current = audio;
    audio.currentTime = 0;
    audio.playbackRate = activeSpeed;

    let finished = false;
    const handleDone = () => {
      if (!finished) {
        finished = true;
        finishIfCurrent();
      }
    };

    audio.onended = handleDone;
    audio.onerror = () => {
      if (playbackId !== playbackIdRef.current) return;

      // Try secondary endpoint if primary fails
      const secAudio = new Audio(secondaryUrl);
      currentAudioRef.current = secAudio;
      secAudio.onended = handleDone;
      secAudio.onerror = () => {
        // Fallback to Web Speech API or WebAudio chime
        tryWebSpeechFallback(japaneseChar, activeSpeed, playbackId, finishIfCurrent);
      };
      secAudio.play().catch(() => {
        tryWebSpeechFallback(japaneseChar, activeSpeed, playbackId, finishIfCurrent);
      });
    };

    // Play HTML5 Audio instantly
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (playbackId !== playbackIdRef.current) return;
        tryWebSpeechFallback(japaneseChar, activeSpeed, playbackId, finishIfCurrent);
      });
    }

    // Safety timeout to reset state
    setTimeout(handleDone, Math.max(400, Math.round(1200 / activeSpeed)));

  }, [enabled, playbackSpeed, stopAudio]);

  const tryWebSpeechFallback = (
    japaneseChar: string, 
    activeSpeed: number, 
    playbackId: number, 
    onFinish: () => void
  ) => {
    if (playbackId !== playbackIdRef.current) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const synth = window.speechSynthesis;
        synth.cancel(); // Clear queue to avoid double audio

        const voices = voicesRef.current.length > 0 ? voicesRef.current : synth.getVoices();
        const preferredVoice = pickJapaneseVoice(voices);

        const utterance = new SpeechSynthesisUtterance(japaneseChar);
        utterance.lang = 'ja-JP';
        utterance.rate = Math.min(Math.max(activeSpeed, 0.7), 1.8);
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
          if (playbackId === playbackIdRef.current) onFinish();
        };
        utterance.onerror = () => {
          if (playbackId === playbackIdRef.current) onFinish();
        };

        synth.speak(utterance);
        return;
      } catch (e) {}
    }

    // Last resort fallback chime
    playWebAudioTone();
    onFinish();
  };

  return {
    speakText,
    stopAudio,
    isPlaying,
    playingText,
    playbackSpeed,
    setPlaybackSpeed
  };
}
