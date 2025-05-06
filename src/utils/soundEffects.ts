
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

// URLs for Supabase stored sounds
const BEEP_SOUND_URL = 'https://zngumulpqrukuzglevem.supabase.co/storage/v1/object/public/sounds/beep-23.mp3';
const WORK_STARTED_SOUND_URL = 'https://zngumulpqrukuzglevem.supabase.co/storage/v1/object/public/sounds/Work%20session%20started.mp3';
// Using beep sound as fallback for rest since we don't have a specific one yet
const REST_STARTED_SOUND_URL = BEEP_SOUND_URL;

// Create audio instances
let beepSound: HTMLAudioElement | null = null;
let workStartedSound: HTMLAudioElement | null = null;
let restStartedSound: HTMLAudioElement | null = null;

// Fallback to use if specific sounds aren't available
const FALLBACK_SOUND_URL = BEEP_SOUND_URL;

// Initialize sounds (called when the app starts)
export const initSounds = () => {
  try {
    // Create sounds with fallback options
    beepSound = createSound(BEEP_SOUND_URL);
    beepSound.addEventListener('error', () => {
      console.log('Beep sound failed to load, using fallback');
      beepSound = createSound(FALLBACK_SOUND_URL);
    });
    
    workStartedSound = createSound(WORK_STARTED_SOUND_URL);
    workStartedSound.addEventListener('error', () => {
      console.log('Work started sound failed to load, using fallback');
      workStartedSound = createSound(FALLBACK_SOUND_URL);
    });
    
    restStartedSound = createSound(REST_STARTED_SOUND_URL);
    restStartedSound.addEventListener('error', () => {
      console.log('Rest started sound failed to load, using fallback');
      restStartedSound = createSound(FALLBACK_SOUND_URL);
    });
    
    // Preload sounds
    beepSound.load();
    workStartedSound.load();
    restStartedSound.load();
    
    console.log('Sound effects initialized with Supabase sounds');
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
