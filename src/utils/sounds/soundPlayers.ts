
// Sound player functions for different sound types
import { playFallbackSound } from './fallbackPlayer';
import { getAudioContext } from './audioContext';
import { BEEP_SOUND_URL } from './constants';

// Sound instances
let beepSound: HTMLAudioElement | null = null;

/**
 * Set sound instances for playback
 */
export const setSoundInstances = (
  beep: HTMLAudioElement | null
): void => {
  beepSound = beep;
};

/**
 * Play the beep sound with fallback
 * Configured to mix with background audio without interruption
 */
export const playBeepSound = (): void => {
  try {
    // Always create a new audio element for each play to avoid issues with rapid playback
    // and to ensure it doesn't interrupt other audio
    const tempBeep = new Audio(BEEP_SOUND_URL);
    
    // Set properties to ensure it doesn't pause background audio
    tempBeep.volume = 0.7;
    tempBeep.preservesPitch = false;
    
    // Critical settings to prevent interrupting other audio
    if ('mozAudioChannelType' in tempBeep) {
      (tempBeep as any).mozAudioChannelType = 'normal';
    }
    
    // These attributes help in mobile browsers
    tempBeep.setAttribute('playsinline', '');
    tempBeep.setAttribute('webkit-playsinline', '');
    
    // Play the sound
    tempBeep.play().then(() => {
      console.log('Beep2 sound played successfully');
    }).catch(e => {
      console.warn('Could not play beep2 sound, falling back:', e);
      playFallbackSound();
    });
  } catch (e) {
    console.warn('Error playing beep2 sound:', e);
    playFallbackSound();
  }
};

// Empty placeholder functions for backward compatibility
export const playWorkStartedSound = (): void => {};
export const playRestStartedSound = (): void => {};
