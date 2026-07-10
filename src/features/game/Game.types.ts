export type Direction = "up" | "down" | "left" | "right";

export type GameStatus = "ready" | "active" | "game-over" | "completed";

export type Position = Readonly<{
  x: number;
  y: number;
}>;

export type GameConfig = Readonly<{
  board: Readonly<{
    width: number;
    height: number;
  }>;
  session: Readonly<{
    initialLives: number;
  }>;
  snake: Readonly<{
    initialLength: number;
  }>;
  scoring: Readonly<{
    pointsPerFood: number;
  }>;
  speed: Readonly<{
    initialTickMs: number;
    minimumTickMs: number;
    progression: Readonly<{
      initialLevel: number;
      foodsPerLevel: number;
      tickReductionMs: number;
    }>;
  }>;
}>;

export type RandomSource = () => number;

export type GameDependencies = Readonly<{
  config: GameConfig;
  random: RandomSource;
}>;

export type GameEvent =
  | Readonly<{ type: "direction"; direction: Direction }>
  | Readonly<{ type: "tick" }>
  | Readonly<{ type: "restart" }>;

export type GameState = Readonly<{
  status: GameStatus;
  snake: ReadonlyArray<Position>;
  food: Position | null;
  direction: Direction;
  bufferedTurn: Direction | null;
  foodsEaten: number;
  score: number;
  lives: number;
  tickMs: number;
  speedLevel: number;
}>;
