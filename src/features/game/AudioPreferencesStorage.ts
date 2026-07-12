import type { AudioPreferences } from "./GameAudioPlayer";
import {
  createJsonStorage,
  type JsonStorage,
  type KeyValueStorage,
  type ReportStorageError,
} from "./JsonStorage";

const AUDIO_PREFERENCES_STORAGE_KEY = "neon-snake.audio-preferences.v1";
const DEFAULT_AUDIO_PREFERENCES: AudioPreferences = {
  effectsEnabled: true,
  musicEnabled: true,
};

export type AudioPreferencesStorage = JsonStorage<AudioPreferences, []>;

function isAudioPreferences(value: unknown): value is AudioPreferences {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const preferences = value as Partial<AudioPreferences>;

  return (
    typeof preferences.effectsEnabled === "boolean" &&
    typeof preferences.musicEnabled === "boolean"
  );
}

export function createAudioPreferencesStorage(
  storage: KeyValueStorage,
  reportError: ReportStorageError,
): AudioPreferencesStorage {
  return createJsonStorage(storage, reportError, {
    defaultValue: DEFAULT_AUDIO_PREFERENCES,
    key: AUDIO_PREFERENCES_STORAGE_KEY,
    loadErrorMessage: "Unable to load audio preferences.",
    restore(value): AudioPreferences {
      return isAudioPreferences(value) ? value : DEFAULT_AUDIO_PREFERENCES;
    },
    saveErrorMessage: "Unable to save audio preferences.",
  });
}
