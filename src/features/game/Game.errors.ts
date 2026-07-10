export class GameConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameConfigurationError";
  }
}

export class GameRandomSourceError extends Error {
  constructor() {
    super(
      "Random source must return a value from 0 up to, but not including, 1.",
    );
    this.name = "GameRandomSourceError";
  }
}
