import type { GameConfig, GameState, Position } from "./Game.types";

export type BoardCellIntent = "snake-head" | "snake-body" | "food" | "empty";

export type BoardCell = Readonly<{
  key: string;
  position: Position;
  intent: BoardCellIntent;
}>;

function positionsMatch(left: Position, right: Position): boolean {
  return left.x === right.x && left.y === right.y;
}

function deriveCellIntent(
  state: GameState,
  position: Position,
): BoardCellIntent {
  const segmentIndex = state.snake.findIndex((segment) =>
    positionsMatch(segment, position),
  );

  if (segmentIndex === 0) {
    return "snake-head";
  }

  if (segmentIndex > 0) {
    return "snake-body";
  }

  if (state.food !== null && positionsMatch(state.food, position)) {
    return "food";
  }

  return "empty";
}

export function createBoardCells(
  board: GameConfig["board"],
  state: GameState,
): ReadonlyArray<BoardCell> {
  return Array.from({ length: board.width * board.height }, (_, index) => {
    const position = {
      x: index % board.width,
      y: Math.floor(index / board.width),
    };

    return {
      key: `${position.x}-${position.y}`,
      position,
      intent: deriveCellIntent(state, position),
    };
  });
}
