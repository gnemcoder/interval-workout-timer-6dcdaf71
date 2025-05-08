
// Main sound effects management and public API
import { BEEP_SOUND_URL } from './constants';
import { initAudioContext } from './audioContext';
import { createSoundWithFallback } from './soundCreation';
import { setSoundInstances, playBeepSound } from './soundPlayers';

/**
 * Initialize sound effects - simplified to only handle beep2.mp3
 */
export const initSounds = (): void => {
  try {
    // Initialize Web Audio API
    initAudioContext();
    
    // Create the beep sound instance
    const beepSound = createSoundWithFallback(BEEP_SOUND_URL);
    
    // Set sound instance for player
    setSoundInstances(beepSound);
    
    console.log('Sound effect initialized with beep2.mp3');
    
    // Add one-time play attempt to handle user interaction requirement
    document.addEventListener('click', function initialInteraction() {
      // Try to play a silent sound to unlock audio
      const silentSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
      silentSound.volume = 0.01;
      silentSound.play().then(() => {
        console.log("Audio playback unlocked by user interaction");
        document.removeEventListener('click', initialInteraction);
      }).catch(e => {
        console.warn("Could not unlock audio:", e);
      });
    });
    
  } catch (e) {
    console.error('Error initializing sounds:', e);
  }
};

// Export the public sound player function
export { playBeepSound };
