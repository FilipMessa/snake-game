import type { FC } from "react";

import type { GameDependencies, GameState } from "./Game.types";

interface LiveMessageProps {
  readonly initialLives: GameDependencies["config"]["session"]["initialLives"];
  readonly state: GameState;
}

export const LiveMessage: FC<LiveMessageProps> = ({ initialLives, state }) => {
  const message =
    state.status === "game-over"
      ? `Game over. Final score ${state.score}.`
      : state.status === "completed"
        ? `You win. Final score ${state.score}.`
        : state.status === "ready" && state.lives < initialLives
          ? `Life lost. ${state.lives} lives remaining.`
          : "";

  return (
    <p aria-live="polite" className="sr-only">
      {message}
    </p>
  );
};
