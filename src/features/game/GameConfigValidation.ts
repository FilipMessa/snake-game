import type { GameDependencies } from "./Game.types";
import { GameConfigurationError } from "./Game.errors";

function ensurePositiveInteger(value: number, message: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new GameConfigurationError(message);
  }
}

function validateBoardConfig(config: GameDependencies["config"]): void {
  ensurePositiveInteger(
    config.board.width,
    "Board dimensions must be positive integers.",
  );
  ensurePositiveInteger(
    config.board.height,
    "Board dimensions must be positive integers.",
  );
}

function validateSnakeConfig(config: GameDependencies["config"]): void {
  ensurePositiveInteger(
    config.snake.initialLength,
    "Snake initial length must be a positive integer.",
  );

  if (config.snake.initialLength > config.board.width) {
    throw new GameConfigurationError(
      "Snake initial length must fit within the board width.",
    );
  }
}

function validateSessionConfig(config: GameDependencies["config"]): void {
  ensurePositiveInteger(
    config.session.initialLives,
    "Initial lives must be a positive integer.",
  );
}

function validateScoringConfig(config: GameDependencies["config"]): void {
  ensurePositiveInteger(
    config.scoring.pointsPerFood,
    "Points per food must be a positive integer.",
  );
}

function validateSpeedConfig(config: GameDependencies["config"]): void {
  const speedValues = [
    config.speed.initialTickMs,
    config.speed.minimumTickMs,
    config.speed.progression.initialLevel,
    config.speed.progression.foodsPerLevel,
    config.speed.progression.tickReductionMs,
  ];

  if (speedValues.some((value) => !Number.isInteger(value) || value <= 0)) {
    throw new GameConfigurationError("Speed values must be positive integers.");
  }

  if (config.speed.minimumTickMs > config.speed.initialTickMs) {
    throw new GameConfigurationError(
      "Minimum tick duration cannot exceed the initial tick duration.",
    );
  }
}

export function validateGameConfig(config: GameDependencies["config"]): void {
  validateBoardConfig(config);
  validateSnakeConfig(config);
  validateSessionConfig(config);
  validateScoringConfig(config);
  validateSpeedConfig(config);
}