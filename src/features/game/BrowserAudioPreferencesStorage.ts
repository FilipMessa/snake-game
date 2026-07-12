import { logError } from "../../shared/logger/LoggerService";
import { createAudioPreferencesStorage } from "./AudioPreferencesStorage";
import { BROWSER_STORAGE } from "./BrowserStorage";

export const BROWSER_AUDIO_PREFERENCES_STORAGE = createAudioPreferencesStorage(
  BROWSER_STORAGE,
  logError,
);
