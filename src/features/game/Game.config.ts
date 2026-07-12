import type { GameConfig } from "./Game.types";

export const DEFAULT_GAME_CONFIG = {
  board: {
    width: 20,
    height: 20,
  },
  session: {
    initialLives: 3,
  },
  snake: {
    initialLength: 3,
  },
  scoring: {
    pointsPerFood: 10,
  },
  speed: {
    initialTickMs: 180,
    minimumTickMs: 80,
    progression: {
      initialLevel: 1,
      foodsPerLevel: 5,
      tickReductionMs: 10,
    },
  },
} as const satisfies GameConfig;

export const UI_CONFIG = {
  animation: {
    foodFadeInMs: 150,
    lifeLossPulseMs: 260,
  },
  board: {
    maximumSizePx: 640,
  },
  leaderboard: {
    maximumEntries: 10,
    maximumPlayerNameLength: 20,
  },
} as const;
