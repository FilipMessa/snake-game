import { useEffect, useRef, useState } from "react";

import { deriveAudioCues } from "../GameAudioCueService";
import {
  createGameAudioPlayer,
  type AudioPreferences,
} from "../GameAudioPlayer";
import type { GameState } from "../Game.types";

export function useGameAudioPlayback(
  state: GameState,
  preferences: AudioPreferences,
): void {
  const previousStateRef = useRef(state);
  const [player] = useState(createGameAudioPlayer);

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
  }, [player, preferences, state.status]);
}
