
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
let beepSound: HTMLAudioElement | null = null;
let workStartedSound: HTMLAudioElement | null = null;
let restStartedSound: HTMLAudioElement | null = null;

// Fallback to use if specific sounds aren't available
const FALLBACK_SOUND_URL = '/beep.mp3';

// Initialize sounds (called when the app starts)
export const initSounds = () => {
  try {
    // Create sounds with fallback options
    beepSound = createSound('/sounds/beep.mp3');
    beepSound.addEventListener('error', () => {
      console.log('Beep sound failed to load, using fallback');
      beepSound = createSound(FALLBACK_SOUND_URL);
    });
    
    workStartedSound = createSound('/sounds/work_started.mp3');
    workStartedSound.addEventListener('error', () => {
      console.log('Work started sound failed to load, using fallback');
      workStartedSound = createSound(FALLBACK_SOUND_URL);
    });
    
    restStartedSound = createSound('/sounds/rest_started.mp3');
    restStartedSound.addEventListener('error', () => {
      console.log('Rest started sound failed to load, using fallback');
      restStartedSound = createSound(FALLBACK_SOUND_URL);
    });
    
    // Preload sounds
    beepSound.load();
    workStartedSound.load();
    restStartedSound.load();
    
    console.log('Sound effects initialized');
  } catch (e) {
    console.error('Error initializing sounds:', e);
  }
};

// Play sound functions with additional error handling
export const playBeepSound = () => {
  if (beepSound) {
    try {
      beepSound.currentTime = 0;
      beepSound.play().catch(e => {
        console.warn('Could not play beep sound:', e);
        // Try fallback sound if main sound fails
        const fallback = new Audio(FALLBACK_SOUND_URL);
        fallback.play().catch(e => console.warn('Fallback sound also failed:', e));
      });
    } catch (e) {
      console.warn('Error playing beep sound:', e);
    }
  } else {
    console.warn('Beep sound not initialized');
  }
};

export const playWorkStartedSound = () => {
  if (workStartedSound) {
    try {
      workStartedSound.currentTime = 0;
      workStartedSound.play().catch(e => {
        console.warn('Could not play work started sound:', e);
        // Try fallback sound if main sound fails
        const fallback = new Audio(FALLBACK_SOUND_URL);
        fallback.play().catch(e => console.warn('Fallback sound also failed:', e));
      });
    } catch (e) {
      console.warn('Error playing work started sound:', e);
    }
  } else {
    console.warn('Work started sound not initialized');
  }
};

export const playRestStartedSound = () => {
  if (restStartedSound) {
    try {
      restStartedSound.currentTime = 0;
      restStartedSound.play().catch(e => {
        console.warn('Could not play rest started sound:', e);
        // Try fallback sound if main sound fails
        const fallback = new Audio(FALLBACK_SOUND_URL);
        fallback.play().catch(e => console.warn('Fallback sound also failed:', e));
      });
    } catch (e) {
      console.warn('Error playing rest started sound:', e);
    }
  } else {
    console.warn('Rest started sound not initialized');
  }
};
