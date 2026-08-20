import { useState, useCallback } from 'react';

export function useAudio(enabled: boolean) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingText, setPlayingText] = useState<string | null>(null);

  const speakText = useCallback((text: string) => {
    if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      setIsPlaying(true);
      setPlayingText(text);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;

      const stopAudio = () => {
        setIsPlaying(false);
        setPlayingText(null);
      };

      utterance.onend = stopAudio;
      utterance.onerror = stopAudio;

      window.speechSynthesis.speak(utterance);

      // Safety timeout after 1.5 seconds in case browser doesn't trigger onend
      setTimeout(() => {
        setIsPlaying(false);
        setPlayingText(null);
      }, 1500);

    } catch (e) {
      setIsPlaying(false);
      setPlayingText(null);
    }
  }, [enabled]);

  return {
    speakText,
    isPlaying,
    playingText
  };
}
