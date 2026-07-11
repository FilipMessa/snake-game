import type { GameState } from "./Game.types";

export type GameAudioCue =
  "start" | "food-eaten" | "level-up" | "life-lost" | "game-over" | "victory";

export function deriveAudioCues(
  previous: GameState,
  next: GameState,
): ReadonlyArray<GameAudioCue> {
  if (previous.status === "active" && next.status === "game-over") {
    return ["game-over"];
  }

  if (previous.status === "active" && next.status === "completed") {
    return ["victory"];
  }

  if (
    previous.status === "active" &&
    next.status === "ready" &&
    next.lives < previous.lives
  ) {
    return ["life-lost"];
  }

  if (previous.status === "ready" && next.status === "active") {
    return ["start"];
  }

  if (next.foodsEaten > previous.foodsEaten) {
    const cues: GameAudioCue[] = ["food-eaten"];

    if (next.speedLevel > previous.speedLevel) {
      cues.push("level-up");
    }

    return cues;
  }

  return [];
}
