
// Sound file URLs and other constants

// URL for the local beep2.mp3 sound
export const BEEP_SOUND_URL = '/sounds/beep2.mp3';

// Default fallback sound
export const FALLBACK_SOUND_URL = BEEP_SOUND_URL;

// Audio session types (for different playback behaviors)
export enum AudioSessionType {
  // Non-exclusive audio - mixes with other apps like Spotify
  MIXED = 'mixed',
  // Exclusive audio - pauses other audio apps
  EXCLUSIVE = 'exclusive'
}

// Default audio session type
export const DEFAULT_AUDIO_SESSION = AudioSessionType.MIXED;
