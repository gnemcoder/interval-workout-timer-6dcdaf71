
/**
 * Re-export from the new sound modules structure for backward compatibility
 * This file serves as a compatibility layer for code that uses the old import path
 */
export {
  initSounds,
  playBeepSound,
  playWorkStartedSound,
  playRestStartedSound
} from './sounds';
