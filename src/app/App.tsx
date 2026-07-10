import type { FC } from "react";

import { DEFAULT_GAME_CONFIG } from "../features/game/Game.config";
import { Game } from "../features/game/Game";
import { GameErrorBoundary } from "./GameErrorBoundary";

const GAME_DEPENDENCIES = {
  config: DEFAULT_GAME_CONFIG,
  random: Math.random,
} as const;

export const App: FC = () => {
  return (
    <GameErrorBoundary>
      <Game dependencies={GAME_DEPENDENCIES} />
    </GameErrorBoundary>
  );
};
