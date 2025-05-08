
// Main sound effects management and public API
import { BEEP_SOUND_URL } from './constants';
import { initAudioContext, preloadSoundBuffer } from './audioContext';
import { playBeepSound } from './soundPlayers';

/**
 * Initialize sound effects with improved mobile support
 */
export const initSounds = async (): Promise<void> => {
  try {
    console.log('Initializing sound system with iOS optimizations');
    
    // Initialize Web Audio API with mobile-friendly settings
    initAudioContext();
    
    // Preload the beep sound for better performance
    await preloadSoundBuffer(BEEP_SOUND_URL);
    
    // Add visibility change handling for background/foreground transitions
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Test a silent sound to unlock audio on iOS
    trySilentSound();
    
    console.log('Sound effect system initialized successfully');
  } catch (e) {
    console.error('Error initializing sounds:', e);
  }
};

/**
 * Handle app going to background/foreground
 */
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    // App came to foreground - reinitialize audio if needed
    console.log('App returned to foreground, checking audio system');
    initAudioContext();
  }
};

/**
 * Try playing a silent sound to unlock audio on iOS
 */
const trySilentSound = () => {
  // This is needed for iOS to allow audio playback
  document.addEventListener('touchstart', function initialTouch() {
    // Create and play a silent sound
    const silentSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
    silentSound.volume = 0.001; // Nearly silent
    
    // Critical iOS settings
    silentSound.setAttribute('playsinline', '');
    silentSound.setAttribute('webkit-playsinline', '');
    (silentSound as any).webkitPreservesPitch = false;
    
    silentSound.play().then(() => {
      console.log("Audio playback unlocked by user interaction");
      document.removeEventListener('touchstart', initialTouch);
    }).catch(e => {
      console.warn("Could not unlock audio:", e);
    });
  }, { once: true });
};

// Export the public sound player function
export { playBeepSound };
