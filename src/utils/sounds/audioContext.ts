// Audio context management for better cross-platform compatibility
// Especially focused on iOS Safari support

// We need a Web Audio Context with special configuration for mobile
let audioContext: AudioContext | null = null;
let audioInitialized = false;
let audioBuffer: AudioBuffer | null = null;

/**
 * Initialize the Web Audio API context with iOS-friendly configuration
 */
export const initAudioContext = (): void => {
  try {
    if (typeof window !== 'undefined' && !audioInitialized) {
      // Get the appropriate AudioContext for the browser
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      
      if (AudioContextClass) {
        audioContext = new AudioContextClass({
          // iOS Safari specific options
          latencyHint: 'interactive',
          sampleRate: 44100,
        });
        
        // Critical for iOS - need user interaction to start audio context
        const unlockAudioContext = () => {
          if (audioContext && (audioContext.state === 'suspended' || audioContext.state === 'closed')) {
            audioContext.resume().then(() => {
              console.log('AudioContext resumed successfully');
              
              // Setup iOS specific session properties via a silent sound
              const emptyBuffer = audioContext.createBuffer(2, 1, 44100);
              const source = audioContext.createBufferSource();
              source.buffer = emptyBuffer;
              source.connect(audioContext.destination);
              
              // Use specific start time to work around iOS limitations
              source.start(0);
              
              // Set up audio session properties for iOS
              if ('webkitAudioContext' in window) {
                // This is for iOS Safari - attempt to configure audio session
                const silenceSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
                silenceSound.volume = 0.01;
                silenceSound.loop = true; // Keep it looping to maintain the audio session
                
                // Critical properties to allow background audio and mixing
                silenceSound.setAttribute('playsinline', '');
                (silenceSound as any).webkitPreservesPitch = false;
                
                // The purpose is to initialize the audio session properly
                silenceSound.play().catch(e => console.warn("iOS audio session setup failed:", e));
              }
            }).catch(err => {
              console.error('Failed to resume AudioContext:', err);
            });
          }
        };

        // Multiple event types to handle iOS Safari quirks
        const interactionEvents = ['touchend', 'touchstart', 'click'];
        
        interactionEvents.forEach(eventType => {
          document.addEventListener(eventType, unlockAudioContext, { once: false });
        });
        
        // Also try to resume when visibility changes (app comes back to foreground)
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            unlockAudioContext();
          }
        });
        
        audioInitialized = true;
        console.log('Audio context initialized with mobile-friendly settings:', audioContext.state);
      } else {
        console.warn('WebAudio not supported in this browser');
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

/**
 * Preload and decode the sound buffer - improves performance especially on mobile
 */
export const preloadSoundBuffer = async (url: string): Promise<void> => {
  try {
    if (!audioContext) return;
    
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log('Sound buffer preloaded successfully');
  } catch (e) {
    console.warn('Failed to preload sound buffer:', e);
  }
};

/**
 * Get the cached audio buffer
 */
export const getSoundBuffer = (): AudioBuffer | null => {
  return audioBuffer;
};

/**
 * Play a sound using Web Audio API with optimal mobile settings
 */
export const playSoundWithWebAudio = (buffer: AudioBuffer | null = audioBuffer): void => {
  if (!audioContext || !buffer) return;
  
  try {
    // Make sure context is running
    if (audioContext.state !== 'running') {
      audioContext.resume().catch(e => console.warn('Could not resume context:', e));
    }
    
    // Create source and connect
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    
    // Create gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.7; // 70% volume
    
    // Connect the nodes: source -> gain -> destination
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Use specific settings for source
    source.playbackRate.value = 1.0;
    
    // Start the sound immediately
    source.start(0);
    
    // Log for debugging
    console.log('Sound played with Web Audio API');
  } catch (e) {
    console.error('Error playing sound with Web Audio API:', e);
  }
};
