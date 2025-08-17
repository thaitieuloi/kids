import { useEffect, useRef } from 'react';
import { audioManager } from '@/lib/audio-utils';

export function useAudio(settings?: { feedbackSound?: boolean; numberReading?: boolean; transitionSound?: boolean }) {
  const audioRef = useRef(audioManager);

  useEffect(() => {
    if (settings) {
      audioRef.current.setEnabled(settings.feedbackSound || settings.transitionSound || false);
    }
  }, [settings]);

  const playCorrect = () => {
    if (settings?.feedbackSound) {
      audioRef.current.playCorrectSound();
    }
  };

  const playIncorrect = () => {
    if (settings?.feedbackSound) {
      audioRef.current.playIncorrectSound();
    }
  };

  const playTransition = () => {
    if (settings?.transitionSound) {
      audioRef.current.playTransitionSound();
    }
  };

  const speakNumber = (number: number) => {
    if (settings?.numberReading) {
      audioRef.current.speakNumber(number);
    }
  };

  return {
    playCorrect,
    playIncorrect,
    playTransition,
    speakNumber
  };
}
