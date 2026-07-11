import { useEffect, useRef, useState } from "react";

import { logError } from "../../../shared/logger/LoggerService";
import { deriveAudioCues } from "../GameAudioCueService";
import {
  createGameAudioPlayer,
  type AudioPreferences,
} from "../GameAudioPlayer";
import type { GameState } from "../Game.types";

export type UseGameAudioResult = Readonly<{
  preferences: AudioPreferences;
  toggleEffects(): void;
  toggleMusic(): void;
}>;

const AUDIO_PREFERENCES_STORAGE_KEY = "neon-snake.audio-preferences.v1";
const DEFAULT_AUDIO_PREFERENCES: AudioPreferences = {
  musicEnabled: true,
  effectsEnabled: true,
};

function loadAudioPreferences(): AudioPreferences {
  try {
    const storedPreferences = window.localStorage.getItem(
      AUDIO_PREFERENCES_STORAGE_KEY,
    );

    if (storedPreferences === null) {
      return DEFAULT_AUDIO_PREFERENCES;
    }

    const parsedPreferences: unknown = JSON.parse(storedPreferences);

    if (
      typeof parsedPreferences === "object" &&
      parsedPreferences !== null &&
      typeof (parsedPreferences as AudioPreferences).musicEnabled ===
        "boolean" &&
      typeof (parsedPreferences as AudioPreferences).effectsEnabled ===
        "boolean"
    ) {
      return parsedPreferences as AudioPreferences;
    }
  } catch (error) {
    logError("Unable to load audio preferences.", error);
    return DEFAULT_AUDIO_PREFERENCES;
  }

  return DEFAULT_AUDIO_PREFERENCES;
}

function saveAudioPreferences(preferences: AudioPreferences): void {
  try {
    window.localStorage.setItem(
      AUDIO_PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferences),
    );
  } catch (error) {
    logError("Unable to save audio preferences.", error);
  }
}

export function useGameAudio(state: GameState): UseGameAudioResult {
  const previousStateRef = useRef(state);
  const [player] = useState(createGameAudioPlayer);
  const [preferences, setPreferences] = useState(loadAudioPreferences);

  useEffect(() => {
    const unlockAudio = (): void => player.unlock();

    window.addEventListener("keydown", unlockAudio, {
      capture: true,
      once: true,
    });
    window.addEventListener("pointerdown", unlockAudio, {
      capture: true,
      once: true,
    });

    return () => {
      window.removeEventListener("keydown", unlockAudio, { capture: true });
      window.removeEventListener("pointerdown", unlockAudio, { capture: true });
      player.dispose();
    };
  }, [player]);

  useEffect(() => {
    const cues = deriveAudioCues(previousStateRef.current, state);

    player.play(cues);
    player.syncMusic(state.status);
    previousStateRef.current = state;
  }, [player, state]);

  useEffect(() => {
    player.setPreferences(preferences);
    player.syncMusic(state.status);
    saveAudioPreferences(preferences);
  }, [player, preferences, state.status]);

  const toggleMusic = (): void => {
    setPreferences((current) => ({
      ...current,
      musicEnabled: !current.musicEnabled,
    }));
  };

  const toggleEffects = (): void => {
    setPreferences((current) => ({
      ...current,
      effectsEnabled: !current.effectsEnabled,
    }));
  };

  return { preferences, toggleEffects, toggleMusic };
}
