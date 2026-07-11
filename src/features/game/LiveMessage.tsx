import type { FC } from "react";

import type { GameState } from "./Game.types";

interface LiveMessageProps {
  readonly state: GameState;
}

export const LiveMessage: FC<LiveMessageProps> = ({ state }) => {
  const message =
    state.status === "game-over"
      ? `Game over. Final score ${state.score}.`
      : state.status === "completed"
        ? `You win. Final score ${state.score}.`
        : state.status === "active" && state.collisionLocked
          ? `Life lost. ${state.lives} lives remaining.`
          : "";

  return (
    <p aria-live="polite" className="sr-only">
      {message}
    </p>
  );
};
