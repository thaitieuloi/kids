import { Audio } from 'expo-av';

export const playSoundFromUrl = async (uri: string, timeoutMs = 5000) => {
  let sound: Audio.Sound | null = null;

  try {
    const result = await Audio.Sound.createAsync({ uri });
    sound = result.sound;

    await sound.playAsync();

    // Wait until sound finishes OR timeout
    await Promise.race([
      new Promise<void>((resolve) => {
        const statusCallback = (status: any) => {
          if (status.isLoaded && status.didJustFinish) {
            sound?.setOnPlaybackStatusUpdate(null); // 🧹 cleanup
            resolve();
          }
        };
        sound?.setOnPlaybackStatusUpdate(statusCallback);
      }),
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('⏰ Timeout waiting for sound to finish')), timeoutMs),
      ),
    ]);
  } catch (err) {
    console.warn(`🔊 Failed to play sound [${uri}]:`, err);
  } finally {
    try {
      await sound?.unloadAsync();
    } catch (e) {
      console.warn('🧹 Failed to unload sound:', e);
    }
  }
};

// 👇 Play ding/wrong using this:
export const playDing = () => playSoundFromUrl('https://practice.braintalent.edu.vn/Content/Audio/ding.wav');
export const playWrong = () => playSoundFromUrl('https://practice.braintalent.edu.vn/Content/Audio/wrong.mp3');
export const playCorrect = () => playSoundFromUrl('https://practice.braintalent.edu.vn/Content/Audio/applauseV2.mp3');

