
// Fallback sound playback mechanisms for when the primary approach fails
import { FALLBACK_SOUND_URL } from './constants';
import { getAudioContext, playSoundWithWebAudio } from './audioContext';

/**
 * Fallback function that tries multiple approaches to play a sound
 */
export const playFallbackSound = (): void => {
  try {
    // First try Web Audio API approach (preferred for mobile)
    const audioContext = getAudioContext();
    if (audioContext) {
      // Try to fetch and play with Web Audio API
      fetch(FALLBACK_SOUND_URL)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          playSoundWithWebAudio(audioBuffer);
        })
        .catch(e => {
          console.error('Web Audio API fallback failed:', e);
          tryHTMLAudioPlayback();
        });
    } else {
      // No AudioContext, try HTML Audio
      tryHTMLAudioPlayback();
    }
  } catch (e) {
    console.error('All sound fallback mechanisms failed:', e);
    tryHTMLAudioPlayback();
  }
};

/**
 * HTML Audio approach as a last resort
 */
const tryHTMLAudioPlayback = (): void => {
  try {
    // Try a different approach with HTML Audio
    const fallback = new Audio(FALLBACK_SOUND_URL);
    
    // Set various properties to maximize chances of playback on mobile
    fallback.volume = 1.0;
    fallback.preload = 'auto';
    
    // Attributes for iOS Safari
    fallback.setAttribute('playsinline', '');
    fallback.setAttribute('webkit-playsinline', '');
    
    // Properties for mixing with other sounds
    if ('preservesPitch' in fallback) {
      (fallback as any).preservesPitch = false;
    }
    
    if ('mozAudioChannelType' in fallback) {
      (fallback as any).mozAudioChannelType = 'normal';
    }
    
    // For debugging
    fallback.onplay = () => console.log('HTML Audio fallback started playing');
    fallback.onended = () => console.log('HTML Audio fallback finished playing');
    fallback.onerror = (e) => console.error('HTML Audio fallback error:', e);
    
    const playPromise = fallback.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.error('HTML Audio fallback also failed:', e);
      });
    }
  } catch (e) {
    console.error('All sound playback methods failed:', e);
  }
};
