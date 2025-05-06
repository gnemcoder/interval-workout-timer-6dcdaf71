
// Sound effects utility for workout timer
const createSound = (url: string): HTMLAudioElement => {
  const audio = new Audio(url);
  // This allows sounds to play alongside other audio on mobile devices
  audio.mozAudioChannelType = 'content' as any;  // Firefox
  if ('webkitAudioContext' in window) {
    // For Safari/Chrome
    audio.playsInline = true;
  }
  // Ensure sounds can play alongside music apps (doesn't pause background music)
  audio.addEventListener('play', () => {
    try {
      // Check and set audio session if available (works on iOS)
      if ('AudioContext' in window || 'webkitAudioContext' in window) {
        audio.preservesPitch = false;
      }
    } catch (e) {
      console.error("Failed to configure audio session:", e);
    }
  });
  return audio;
};

// Create audio instances
let startSound: HTMLAudioElement | null = null;
let workCountdownSound: HTMLAudioElement | null = null;
let restCountdownSound: HTMLAudioElement | null = null;

// Initialize sounds (called when the app starts)
export const initSounds = () => {
  startSound = createSound('/sounds/start.mp3');
  workCountdownSound = createSound('/sounds/work-countdown.mp3');
  restCountdownSound = createSound('/sounds/rest-countdown.mp3');
};

// Play sound functions
export const playStartSound = () => {
  if (startSound) {
    startSound.currentTime = 0;
    startSound.play().catch(e => console.warn('Could not play start sound:', e));
  }
};

export const playWorkCountdownSound = () => {
  if (workCountdownSound) {
    workCountdownSound.currentTime = 0;
    workCountdownSound.play().catch(e => console.warn('Could not play work countdown sound:', e));
  }
};

export const playRestCountdownSound = () => {
  if (restCountdownSound) {
    restCountdownSound.currentTime = 0;
    restCountdownSound.play().catch(e => console.warn('Could not play rest countdown sound:', e));
  }
};
