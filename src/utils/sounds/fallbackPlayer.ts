
// Fallback sound playback mechanisms
import { FALLBACK_SOUND_URL } from './constants';
import { getAudioContext } from './audioContext';

/**
 * Fallback function that tries multiple approaches to play a sound
 */
export const playFallbackSound = (): void => {
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
        tryWebAudioAPIPlayback();
      });
    }
  } catch (e) {
    console.error('Standard fallback playback failed:', e);
    tryWebAudioAPIPlayback();
  }
};

/**
 * Last resort method using Web Audio API directly
 */
const tryWebAudioAPIPlayback = (): void => {
  const audioContext = getAudioContext();
  
  if (audioContext) {
    fetch(FALLBACK_SOUND_URL)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
        console.log('Playing sound using Web Audio API');
      })
      .catch(e => console.error('Web Audio API playback also failed:', e));
  } else {
    console.error('All sound playback methods failed: Audio context not available');
  }
};
