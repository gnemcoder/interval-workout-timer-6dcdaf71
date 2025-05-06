
// Sound creation utilities
import { FALLBACK_SOUND_URL } from './constants';

/**
 * Create an audio element with mobile-friendly settings
 */
export const createSound = (url: string): HTMLAudioElement => {
  const audio = new Audio(url);
  
  try {
    // For Firefox
    (audio as any).mozAudioChannelType = 'content';
    
    // For Safari/Chrome
    if ('webkitAudioContext' in window) {
      (audio as any).playsInline = true;
    }
    
    // Ensure sounds can play alongside music apps (doesn't pause background music)
    audio.addEventListener('play', () => {
      try {
        // Check and set audio session if available (works on iOS)
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
          (audio as any).preservesPitch = false;
        }
      } catch (e) {
        console.error("Failed to configure audio session:", e);
      }
    });
    
    console.log(`Sound created for URL: ${url}`);
  } catch (e) {
    console.error("Failed to set audio properties:", e);
  }
  
  return audio;
};

/**
 * Create sound with error handling and fallback
 */
export const createSoundWithFallback = (
  url: string, 
  onError?: () => void
): HTMLAudioElement => {
  const sound = createSound(url);
  
  sound.addEventListener('error', (e) => {
    console.error(`Sound failed to load: ${url}`, e);
    onError?.();
  });
  
  sound.load();
  return sound;
};
