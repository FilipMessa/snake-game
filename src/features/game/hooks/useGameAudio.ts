import type { AudioPreferences } from "../GameAudioPlayer";
import type { GameState } from "../Game.types";
import { useAudioPreferences } from "./useAudioPreferences";
import { useGameAudioPlayback } from "./useGameAudioPlayback";

export type UseGameAudioResult = Readonly<{
  preferences: AudioPreferences;
  toggleEffects(): void;
  toggleMusic(): void;
}>;

export function useGameAudio(state: GameState): UseGameAudioResult {
  const audioPreferences = useAudioPreferences();

  useGameAudioPlayback(state, audioPreferences.preferences);

  return audioPreferences;
}
