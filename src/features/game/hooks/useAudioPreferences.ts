import { useCallback, useEffect, useState } from "react";

import { BROWSER_AUDIO_PREFERENCES_STORAGE } from "../BrowserAudioPreferencesStorage";
import type { AudioPreferences } from "../GameAudioPlayer";

export type UseAudioPreferencesResult = Readonly<{
  preferences: AudioPreferences;
  toggleEffects(): void;
  toggleMusic(): void;
}>;

export function useAudioPreferences(): UseAudioPreferencesResult {
  const [preferences, setPreferences] = useState(() =>
    BROWSER_AUDIO_PREFERENCES_STORAGE.load(),
  );

  useEffect(() => {
    BROWSER_AUDIO_PREFERENCES_STORAGE.save(preferences);
  }, [preferences]);

  const toggleMusic = useCallback((): void => {
    setPreferences((current) => ({
      ...current,
      musicEnabled: !current.musicEnabled,
    }));
  }, []);

  const toggleEffects = useCallback((): void => {
    setPreferences((current) => ({
      ...current,
      effectsEnabled: !current.effectsEnabled,
    }));
  }, []);

  return { preferences, toggleEffects, toggleMusic };
}
