
// Sound player functions for different sound types
import { playFallbackSound } from './fallbackPlayer';
import { getAudioContext } from './audioContext';
import { BEEP_SOUND_URL } from './constants';

// Sound instances
let beepSound: HTMLAudioElement | null = null;
let workStartedSound: HTMLAudioElement | null = null;
let restStartedSound: HTMLAudioElement | null = null;

/**
 * Set sound instances for playback
 */
export const setSoundInstances = (
  beep: HTMLAudioElement | null,
  workStarted: HTMLAudioElement | null,
  restStarted: HTMLAudioElement | null
): void => {
  beepSound = beep;
  workStartedSound = workStarted;
  restStartedSound = restStarted;
};

/**
 * Play the beep sound with fallback
 */
export const playBeepSound = (): void => {
  if (beepSound) {
    try {
      // If we have an AudioContext, try to use it
      const audioContext = getAudioContext();
      if (audioContext && audioContext.state === 'running') {
        // Create a new audio element for each play to avoid issues with rapid playback
        const tempBeep = new Audio(BEEP_SOUND_URL);
        tempBeep.volume = 0.7;
        tempBeep.play().then(() => {
          console.log('Beep sound played successfully');
        }).catch(e => {
          console.warn('Could not play beep sound with AudioContext, falling back:', e);
          playFallbackSound();
        });
      } else {
        // Standard HTML Audio playback
        beepSound.currentTime = 0;
        beepSound.play().then(() => {
          console.log('Beep sound played successfully');
        }).catch(e => {
          console.warn('Could not play beep sound:', e);
          playFallbackSound();
        });
      }
    } catch (e) {
      console.warn('Error playing beep sound:', e);
      playFallbackSound();
    }
  } else {
    console.warn('Beep sound not initialized');
    playFallbackSound();
  }
};

/**
 * Play the work started sound with fallback
 */
export const playWorkStartedSound = (): void => {
  if (workStartedSound) {
    try {
      workStartedSound.currentTime = 0;
      workStartedSound.play().then(() => {
        console.log('Work started sound played successfully');
      }).catch(e => {
        console.warn('Could not play work started sound:', e);
        playFallbackSound();
      });
    } catch (e) {
      console.warn('Error playing work started sound:', e);
      playFallbackSound();
    }
  } else {
    console.warn('Work started sound not initialized');
    playFallbackSound();
  }
};

/**
 * Play the rest started sound with fallback
 */
export const playRestStartedSound = (): void => {
  if (restStartedSound) {
    try {
      restStartedSound.currentTime = 0;
      restStartedSound.play().then(() => {
        console.log('Rest started sound played successfully');
      }).catch(e => {
        console.warn('Could not play rest started sound:', e);
        playFallbackSound();
      });
    } catch (e) {
      console.warn('Error playing rest started sound:', e);
      playFallbackSound();
    }
  } else {
    console.warn('Rest started sound not initialized');
    playFallbackSound();
  }
};
