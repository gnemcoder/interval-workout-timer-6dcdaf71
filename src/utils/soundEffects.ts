
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
    
    // Add debugging for successful creation
    console.log(`Sound created for URL: ${url}`);
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

// We need a Web Audio Context for better mobile support
let audioContext: AudioContext | null = null;

// Initialize sounds (called when the app starts)
export const initSounds = () => {
  try {
    // Initialize Web Audio API for better mobile support
    try {
      if (typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioContext = new AudioContextClass();
          // On iOS, we need a user gesture to start the audio context
          document.addEventListener('click', () => {
            if (audioContext && audioContext.state === 'suspended') {
              audioContext.resume().then(() => console.log('AudioContext resumed'));
            }
          }, { once: true });
          console.log('Audio context initialized:', audioContext.state);
        }
      }
    } catch (e) {
      console.warn('Could not initialize AudioContext:', e);
    }
    
    // Create sounds with fallback options
    beepSound = createSound(BEEP_SOUND_URL);
    beepSound.addEventListener('error', (e) => {
      console.error('Beep sound failed to load:', e);
      beepSound = createSound(FALLBACK_SOUND_URL);
    });
    
    workStartedSound = createSound(WORK_STARTED_SOUND_URL);
    workStartedSound.addEventListener('error', (e) => {
      console.error('Work started sound failed to load:', e);
      workStartedSound = createSound(FALLBACK_SOUND_URL);
    });
    
    restStartedSound = createSound(REST_STARTED_SOUND_URL);
    restStartedSound.addEventListener('error', (e) => {
      console.error('Rest started sound failed to load:', e);
      restStartedSound = createSound(FALLBACK_SOUND_URL);
    });
    
    // Preload sounds
    beepSound.load();
    workStartedSound.load();
    restStartedSound.load();
    
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

// Play sound functions with additional error handling
export const playBeepSound = () => {
  if (beepSound) {
    try {
      // If we have an AudioContext, try to use it
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

export const playWorkStartedSound = () => {
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

export const playRestStartedSound = () => {
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

// Fallback function that tries multiple approaches to play a sound
const playFallbackSound = () => {
  try {
    // Try a different approach for sound playback
    const fallback = new Audio(FALLBACK_SOUND_URL);
    fallback.volume = 1.0;
    
    // Add playback listeners for debugging
    fallback.onplay = () => console.log('Fallback sound started playing');
    fallback.onended = () => console.log('Fallback sound finished playing');
    fallback.onerror = (e) => console.error('Fallback sound error:', e);
    
    const playPromise = fallback.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.error('Fallback sound also failed:', e);
        // Last resort, try using the Web Audio API directly
        if (audioContext) {
          fetch(FALLBACK_SOUND_URL)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext!.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
              const source = audioContext!.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContext!.destination);
              source.start(0);
              console.log('Playing sound using Web Audio API');
            })
            .catch(e => console.error('Web Audio API playback also failed:', e));
        }
      });
    }
  } catch (e) {
    console.error('All sound playback methods failed:', e);
  }
};
