import type {
  Direction,
  GameDependencies,
  GameEvent,
  GameState,
  Position,
} from "./Game.types";
import { GameRandomSourceError } from "./Game.errors";
import { validateGameConfig } from "./GameConfigValidation";

function createStartingSnake(
  width: number,
  height: number,
  length: number,
): ReadonlyArray<Position> {
  const leftmostX = Math.floor((width - length) / 2);
  const head = {
    x: leftmostX + length - 1,
    y: Math.floor(height / 2),
  };

  return Array.from({ length }, (_, index) => ({
    x: head.x - index,
    y: head.y,
  }));
}

function positionsMatch(left: Position, right: Position): boolean {
  return left.x === right.x && left.y === right.y;
}

function chooseFood(
  width: number,
  height: number,
  snake: ReadonlyArray<Position>,
  random: () => number,
): Position | null {
  const available: Position[] = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const candidate = { x, y };
      if (!snake.some((segment) => positionsMatch(segment, candidate))) {
        available.push(candidate);
      }
    }
  }

  if (available.length === 0) {
    return null;
  }

  const randomValue = random();
  if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
    throw new GameRandomSourceError();
  }

  return available[Math.floor(randomValue * available.length)] ?? null;
}

export function createGameState({
  config,
  random,
}: GameDependencies): GameState {
  validateGameConfig(config);

  const snake = createStartingSnake(
    config.board.width,
    config.board.height,
    config.snake.initialLength,
  );

  return {
    status: "ready",
    snake,
    food: chooseFood(config.board.width, config.board.height, snake, random),
    direction: "right",
    bufferedTurn: null,
    foodsEaten: 0,
    score: 0,
    lives: config.session.initialLives,
    tickMs: config.speed.initialTickMs,
    speedLevel: config.speed.progression.initialLevel,
  };
}

function directionsAreOpposite(
  current: Direction,
  requested: Direction,
): boolean {
  return (
    (current === "up" && requested === "down") ||
    (current === "down" && requested === "up") ||
    (current === "left" && requested === "right") ||
    (current === "right" && requested === "left")
  );
}

function movePosition(position: Position, direction: Direction): Position {
  const offsets: Record<Direction, Position> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  const offset = offsets[direction];

  return {
    x: position.x + offset.x,
    y: position.y + offset.y,
  };
}

function isInsideBoard(
  position: Position,
  board: GameDependencies["config"]["board"],
): boolean {
  return (
    position.x >= 0 &&
    position.x < board.width &&
    position.y >= 0 &&
    position.y < board.height
  );
}

function recoverFromCollision(
  state: GameState,
  { config, random }: GameDependencies,
): GameState {
  const lives = state.lives - 1;
  if (lives === 0) {
    return {
      ...state,
      status: "game-over",
      lives,
      bufferedTurn: null,
    };
  }

  const snake = createStartingSnake(
    config.board.width,
    config.board.height,
    config.snake.initialLength,
  );
  const food = state.food;
  const foodOverlapsSnake =
    food !== null && snake.some((segment) => positionsMatch(segment, food));

  return {
    ...state,
    status: "ready",
    snake,
    food: foodOverlapsSnake
      ? chooseFood(config.board.width, config.board.height, snake, random)
      : food,
    direction: "right",
    bufferedTurn: null,
    lives,
  };
}

function deriveSpeed(
  foodsEaten: number,
  config: GameDependencies["config"]["speed"],
): Pick<GameState, "speedLevel" | "tickMs"> {
  const requestedIncreases = Math.floor(
    foodsEaten / config.progression.foodsPerLevel,
  );
  const maximumIncreases = Math.ceil(
    (config.initialTickMs - config.minimumTickMs) /
      config.progression.tickReductionMs,
  );
  const appliedIncreases = Math.min(requestedIncreases, maximumIncreases);

  return {
    tickMs: Math.max(
      config.minimumTickMs,
      config.initialTickMs -
        appliedIncreases * config.progression.tickReductionMs,
    ),
    speedLevel: config.progression.initialLevel + appliedIncreases,
  };
}

export function transitionGame(
  state: GameState,
  event: GameEvent,
  { config, random }: GameDependencies,
): GameState {
  if (
    (state.status === "game-over" || state.status === "completed") &&
    event.type === "restart"
  ) {
    return createGameState({ config, random });
  }

  if (
    state.status === "ready" &&
    event.type === "direction" &&
    !directionsAreOpposite(state.direction, event.direction)
  ) {
    return {
      ...state,
      status: "active",
      bufferedTurn: event.direction,
    };
  }

  if (
    state.status === "active" &&
    event.type === "direction" &&
    state.bufferedTurn === null &&
    !directionsAreOpposite(state.direction, event.direction)
  ) {
    return {
      ...state,
      bufferedTurn: event.direction,
    };
  }

  if (state.status === "active" && event.type === "tick") {
    const head = state.snake[0];
    if (!head) {
      return state;
    }

    const direction = state.bufferedTurn ?? state.direction;
    const nextHead = movePosition(head, direction);
    if (!isInsideBoard(nextHead, config.board)) {
      return recoverFromCollision(state, { config, random });
    }

    const ateFood = state.food !== null && positionsMatch(nextHead, state.food);
    const collisionBody = ateFood ? state.snake : state.snake.slice(0, -1);
    if (collisionBody.some((segment) => positionsMatch(segment, nextHead))) {
      return recoverFromCollision(state, { config, random });
    }

    const snake = ateFood
      ? [nextHead, ...state.snake]
      : [nextHead, ...state.snake.slice(0, -1)];
    const foodsEaten = state.foodsEaten + (ateFood ? 1 : 0);
    const speed = ateFood
      ? deriveSpeed(foodsEaten, config.speed)
      : { tickMs: state.tickMs, speedLevel: state.speedLevel };
    const food = ateFood
      ? chooseFood(config.board.width, config.board.height, snake, random)
      : state.food;

    return {
      ...state,
      status: ateFood && food === null ? "completed" : state.status,
      snake,
      food,
      direction,
      bufferedTurn: null,
      foodsEaten,
      score: state.score + (ateFood ? config.scoring.pointsPerFood : 0),
      ...speed,
    };
  }

  return state;
}
