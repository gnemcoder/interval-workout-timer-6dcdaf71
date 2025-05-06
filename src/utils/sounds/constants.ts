
// Sound file URLs and other constants

// URLs for Supabase stored sounds
export const BEEP_SOUND_URL = 'https://zngumulpqrukuzglevem.supabase.co/storage/v1/object/public/sounds/beep-23.mp3';
export const WORK_STARTED_SOUND_URL = 'https://zngumulpqrukuzglevem.supabase.co/storage/v1/object/public/sounds/Work%20session%20started.mp3';
// Using beep sound as fallback for rest since we don't have a specific one yet
export const REST_STARTED_SOUND_URL = BEEP_SOUND_URL;

// Default fallback sound
export const FALLBACK_SOUND_URL = BEEP_SOUND_URL;
