import type { GameStatus } from "./Game.types";

const GENERATED_NAME_RANGE = 10_000;

export class PlayerNameValidationError extends Error {
  constructor(maximumLength: number) {
    super(`Player name must not exceed ${maximumLength} characters.`);
    this.name = "PlayerNameValidationError";
  }
}

function createGeneratedPlayerName(random: () => number): string {
  const suffix = Math.floor(random() * GENERATED_NAME_RANGE)
    .toString()
    .padStart(4, "0");

  return `Player-${suffix}`;
}

export function canChangePlayer(status: GameStatus): boolean {
  return status !== "active";
}

export function resolvePlayerName(
  input: string,
  maximumLength: number,
  random: () => number,
): string {
  const trimmedInput = input.trim();

  if (trimmedInput.length === 0) {
    return createGeneratedPlayerName(random);
  }
  if (trimmedInput.length > maximumLength) {
    throw new PlayerNameValidationError(maximumLength);
  }

  return trimmedInput;
}
