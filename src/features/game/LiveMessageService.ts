import type { GameState } from "./Game.types";

export function deriveLiveMessage(state: GameState): string {
  if (state.status === "game-over") {
    return `Game over. Final score ${state.score}.`;
  }

  if (state.status === "completed") {
    return `You win. Final score ${state.score}.`;
  }

  if (state.status === "active" && state.collisionLocked) {
    return `Life lost. ${state.lives} lives remaining.`;
  }

  return "";
}
