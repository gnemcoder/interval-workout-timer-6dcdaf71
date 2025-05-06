
// Main sound effects management and public API
import { 
  BEEP_SOUND_URL, 
  WORK_STARTED_SOUND_URL, 
  REST_STARTED_SOUND_URL
} from './constants';
import { initAudioContext } from './audioContext';
import { createSoundWithFallback } from './soundCreation';
import { 
  setSoundInstances, 
  playBeepSound, 
  playWorkStartedSound, 
  playRestStartedSound 
} from './soundPlayers';

/**
 * Initialize all sound effects
 */
export const initSounds = (): void => {
  try {
    // Initialize Web Audio API
    initAudioContext();
    
    // Create the sound instances
    const beepSound = createSoundWithFallback(BEEP_SOUND_URL);
    const workSound = createSoundWithFallback(WORK_STARTED_SOUND_URL);
    const restSound = createSoundWithFallback(REST_STARTED_SOUND_URL);
    
    // Set sound instances for players
    setSoundInstances(beepSound, workSound, restSound);
    
    console.log('Sound effects initialized with Supabase sounds');
    
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

// Export the public sound player functions
export { playBeepSound, playWorkStartedSound, playRestStartedSound };
