
/**
 * Simplified sound effects module that just exports the beep sound
 * This file serves as a compatibility layer for code that uses the old import path
 */
export {
  initSounds,
  playBeepSound
} from './sounds';

// Define empty functions for backward compatibility
export const playWorkStartedSound = (): void => {};
export const playRestStartedSound = (): void => {};
