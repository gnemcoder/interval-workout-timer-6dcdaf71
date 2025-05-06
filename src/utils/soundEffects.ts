
// Sound effects utility for workout timer
const createSound = (url: string): HTMLAudioElement => {
  const audio = new Audio(url);
  
  // Using type assertions to handle non-standard properties
  // This allows sounds to play alongside other audio on mobile devices
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
  } catch (e) {
    console.error("Failed to set audio properties:", e);
  }
  
  return audio;
};

// Create audio instances
let startSound: HTMLAudioElement | null = null;
let workCountdownSound: HTMLAudioElement | null = null;
let restCountdownSound: HTMLAudioElement | null = null;

// Fallback to use the built-in beep sound if specific sounds aren't available
const FALLBACK_SOUND_URL = '/beep.mp3';

// Initialize sounds (called when the app starts)
export const initSounds = () => {
  try {
    // Create sounds with fallback options
    startSound = createSound('/sounds/start.mp3');
    startSound.addEventListener('error', () => {
      console.log('Start sound failed to load, using fallback');
      startSound = createSound(FALLBACK_SOUND_URL);
    });
    
    workCountdownSound = createSound('/sounds/work-countdown.mp3');
    workCountdownSound.addEventListener('error', () => {
      console.log('Work countdown sound failed to load, using fallback');
      workCountdownSound = createSound(FALLBACK_SOUND_URL);
    });
    
    restCountdownSound = createSound('/sounds/rest-countdown.mp3');
    restCountdownSound.addEventListener('error', () => {
      console.log('Rest countdown sound failed to load, using fallback');
      restCountdownSound = createSound(FALLBACK_SOUND_URL);
    });
    
    // Preload sounds
    startSound.load();
    workCountdownSound.load();
    restCountdownSound.load();
    
    console.log('Sound effects initialized');
  } catch (e) {
    console.error('Error initializing sounds:', e);
  }
};

// Play sound functions with additional error handling
export const playStartSound = () => {
  if (startSound) {
    try {
      startSound.currentTime = 0;
      startSound.play().catch(e => {
        console.warn('Could not play start sound:', e);
        // Try fallback sound if main sound fails
        const fallback = new Audio(FALLBACK_SOUND_URL);
        fallback.play().catch(e => console.warn('Fallback sound also failed:', e));
      });
    } catch (e) {
      console.warn('Error playing start sound:', e);
    }
  } else {
    console.warn('Start sound not initialized');
  }
};

export const playWorkCountdownSound = () => {
  if (workCountdownSound) {
    try {
      workCountdownSound.currentTime = 0;
      workCountdownSound.play().catch(e => {
        console.warn('Could not play work countdown sound:', e);
        // Try fallback sound if main sound fails
        const fallback = new Audio(FALLBACK_SOUND_URL);
        fallback.play().catch(e => console.warn('Fallback sound also failed:', e));
      });
    } catch (e) {
      console.warn('Error playing work countdown sound:', e);
    }
  } else {
    console.warn('Work countdown sound not initialized');
  }
};

export const playRestCountdownSound = () => {
  if (restCountdownSound) {
    try {
      restCountdownSound.currentTime = 0;
      restCountdownSound.play().catch(e => {
        console.warn('Could not play rest countdown sound:', e);
        // Try fallback sound if main sound fails
        const fallback = new Audio(FALLBACK_SOUND_URL);
        fallback.play().catch(e => console.warn('Fallback sound also failed:', e));
      });
    } catch (e) {
      console.warn('Error playing rest countdown sound:', e);
    }
  } else {
    console.warn('Rest countdown sound not initialized');
  }
};
