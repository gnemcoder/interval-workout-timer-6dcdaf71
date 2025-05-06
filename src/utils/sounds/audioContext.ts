
// Audio context management

// We need a Web Audio Context for better mobile support
let audioContext: AudioContext | null = null;

/**
 * Initialize the Web Audio API context
 */
export const initAudioContext = (): void => {
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
};

/**
 * Get the current audio context instance
 */
export const getAudioContext = (): AudioContext | null => {
  return audioContext;
};
