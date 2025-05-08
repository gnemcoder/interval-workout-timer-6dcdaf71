// Sound player functions for different sound types
import { playFallbackSound } from './fallbackPlayer';
import { getAudioContext, playSoundWithWebAudio, getSoundBuffer } from './audioContext';
import { BEEP_SOUND_URL } from './constants';

// Keep track of last play time to prevent too frequent calls
let lastBeepTime = 0;

/**
 * Play the beep sound with optimized mobile settings
 * Configured to mix with background audio without interruption
 */
export const playBeepSound = (): void => {
  try {
    // Prevent too frequent sound playback (debounce)
    const now = Date.now();
    if (now - lastBeepTime < 200) {
      return; // Prevent sounds too close together
    }
    lastBeepTime = now;
    
    // First try to use Web Audio API with cached buffer (best for mobile)
    const cachedBuffer = getSoundBuffer();
    if (cachedBuffer) {
      playSoundWithWebAudio(cachedBuffer);
      console.log('Beep played using cached Web Audio buffer');
      return;
    }
    
    // If we don't have a cached buffer but have AudioContext
    const audioContext = getAudioContext();
    if (audioContext) {
      fetch(BEEP_SOUND_URL)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          playSoundWithWebAudio(audioBuffer);
          console.log('Beep played using fetched Web Audio buffer');
        })
        .catch(e => {
          console.warn('Web Audio playback failed:', e);
          tryHTMLAudio();
        });
    } else {
      // Fallback to HTML Audio element
      tryHTMLAudio();
    }
  } catch (e) {
    console.warn('Error playing beep sound:', e);
    playFallbackSound();
  }
};

/**
 * Try to play using HTML Audio as fallback
 * With special mobile settings
 */
const tryHTMLAudio = (): void => {
  try {
    // Create a new audio element each time for better mobile support
    const tempBeep = new Audio(BEEP_SOUND_URL);
    
    // Critical for iOS - ensures proper audio session behavior
    tempBeep.setAttribute('playsinline', '');
    tempBeep.setAttribute('webkit-playsinline', '');
    tempBeep.preload = 'auto';
    tempBeep.volume = 0.7;
    
    // Properties for mixing with background music
    if ('preservesPitch' in tempBeep) {
      (tempBeep as any).preservesPitch = false;
    }
    
    // Firefox specific setting
    if ('mozAudioChannelType' in tempBeep) {
      (tempBeep as any).mozAudioChannelType = 'content';
    }
    
    // iOS specific settings
    if ('webkitPreservesPitch' in tempBeep) {
      (tempBeep as any).webkitPreservesPitch = false;
    }
    
    tempBeep.play().then(() => {
      console.log('Beep sound played successfully with HTML Audio');
    }).catch(e => {
      console.warn('Could not play beep sound with HTML Audio:', e);
      playFallbackSound();
    });
  } catch (e) {
    console.error('HTML Audio playback failed:', e);
    playFallbackSound();
  }
};

// Empty placeholder functions for backward compatibility
export const playWorkStartedSound = (): void => {};
export const playRestStartedSound = (): void => {};

/**
 * Set sound instances - kept for backward compatibility
 */
export const setSoundInstances = (
  beep: HTMLAudioElement | null
): void => {
  // This is kept for backward compatibility
  // We now create audio elements dynamically or use Web Audio API
};
