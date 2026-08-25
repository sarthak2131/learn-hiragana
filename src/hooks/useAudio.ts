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

    // Must strictly match Japanese language code ('ja', 'ja-JP') or authentic Japanese voice names
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

// Fallback Web Audio API Synthesizer chime for offline / missing audio
function playWebAudioTone() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {}
}

export function useAudio(enabled: boolean) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const audioCacheRef = useRef<Record<string, HTMLAudioElement>>({});
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const playbackIdRef = useRef<number>(0);
  const voicesPromiseRef = useRef<Promise<SpeechSynthesisVoice[]> | null>(null);

  const clearPlaybackState = useCallback(() => {
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
        }, 150);

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
      if (playbackId === playbackIdRef.current) {
        setIsPlaying(false);
        setPlayingText(null);
      }
    };

    // 1. Check Web Speech API first
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const synth = window.speechSynthesis;
        if (synth.paused) {
          synth.resume();
        }

        const voices = await loadVoices();
        if (playbackId !== playbackIdRef.current) return;

        const preferredVoice = pickJapaneseVoice(voices);

        if (preferredVoice) {
          const utterance = new SpeechSynthesisUtterance(japaneseChar);
          utterance.lang = 'ja-JP';
          utterance.rate = Math.min(Math.max(activeSpeed, 0.7), 1.8);
          utterance.voice = preferredVoice;

          utterance.onend = finishIfCurrent;
          utterance.onerror = finishIfCurrent;

          synth.speak(utterance);

          // Fast safety timeout to ensure state doesn't freeze
          setTimeout(finishIfCurrent, Math.max(500, Math.round(1200 / activeSpeed)));
          return;
        }
      } catch (e) {
        // Fall through to HTML5 Audio fallback
      }
    }

    // 2. High Quality Fast HTML5 Audio Fallback (Google Translate TTS + Youdao fallback)
    const primaryUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(japaneseChar)}&tl=ja&client=tw-ob`;
    const secondaryUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(japaneseChar)}&le=jap`;

    let audio = audioCacheRef.current[japaneseChar];
    if (!audio) {
      audio = new Audio(primaryUrl);
      audio.preload = 'auto';
      audioCacheRef.current[japaneseChar] = audio;
    }

    if (playbackId !== playbackIdRef.current) return;

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
      // Try secondary endpoint if primary Google TTS fails
      if (!finished) {
        const secAudio = new Audio(secondaryUrl);
        currentAudioRef.current = secAudio;
        secAudio.onended = handleDone;
        secAudio.onerror = () => {
          playWebAudioTone();
          handleDone();
        };
        secAudio.play().catch(() => {
          playWebAudioTone();
          handleDone();
        });
      }
    };

    audio.play().catch(() => {
      // If play blocked or network error, trigger secondary or tone fallback
      const secAudio = new Audio(secondaryUrl);
      currentAudioRef.current = secAudio;
      secAudio.onended = handleDone;
      secAudio.onerror = () => {
        playWebAudioTone();
        handleDone();
      };
      secAudio.play().catch(() => {
        playWebAudioTone();
        handleDone();
      });
    });

    // Safety timeout so audio state is never stuck playing
    setTimeout(handleDone, 1200);

  }, [enabled, loadVoices, playbackSpeed, stopAudio]);

  return {
    speakText,
    stopAudio,
    isPlaying,
    playingText,
    playbackSpeed,
    setPlaybackSpeed
  };
}
