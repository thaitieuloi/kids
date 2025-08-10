import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';

const DING_SOUND_URL = 'https://practice.braintalent.edu.vn/Content/Audio/ding.wav';

export const useAudioPlayer = (uris: string[], onError: (error: Error) => void) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      soundRef.current?.unloadAsync();
    };
  }, []);

  const playAudio = async () => {
    if (!uris.length) return;

    try {
      // Play ding sound first
      soundRef.current = (await Audio.Sound.createAsync({ uri: DING_SOUND_URL })).sound;
      await soundRef.current.playAsync();
      await new Promise((resolve) => {
        soundRef.current?.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish && isMountedRef.current) resolve(null);
        });
      });

      // Play subsequent audio files
      for (const uri of uris) {
        if (!uri || !uri.endsWith('.mp3') && !uri.endsWith('.wav')) {
            console.warn('⚠️ Invalid audio uri:', uri);
            continue; // bỏ qua uri sai
        }

        try {
            soundRef.current = (await Audio.Sound.createAsync({ uri })).sound;
            await soundRef.current.playAsync();
            await new Promise((resolve) => {
            soundRef.current?.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish && isMountedRef.current) resolve(null);
            });
            });
        } catch (err) {
            onError(err instanceof Error ? err : new Error('Audio load/playback failed'));
        }
        }
    } catch (error) {
      if (isMountedRef.current) onError(error instanceof Error ? error : new Error('Audio playback failed'));
    } finally {
      if (isMountedRef.current) await soundRef.current?.unloadAsync();
    }
  };

  return { playAudio };
};