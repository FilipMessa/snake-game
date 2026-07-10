import type { CSSProperties, FC } from "react";

import { createBoardCells, type BoardCellIntent } from "./GameBoardService";
import type { GameConfig, GameState } from "./Game.types";

interface GameBoardProps {
  readonly board: GameConfig["board"];
  readonly state: GameState;
  readonly foodFadeInMs: number;
  readonly maximumSizePx: number;
}

function deriveCellClassName(intent: BoardCellIntent): string {
  if (intent === "snake-head") {
    return "z-10 rounded-[30%] bg-neon-cyan shadow-[0_0_12px_#22d3ee,0_0_24px_rgba(34,211,238,0.45)]";
  }

  if (intent === "snake-body") {
    return "rounded-[28%] bg-neon-lime shadow-[0_0_9px_rgba(163,230,53,0.8)]";
  }

  if (intent === "food") {
    return "animate-food-in rounded-full bg-neon-magenta shadow-[0_0_12px_#f472b6,0_0_24px_rgba(244,114,182,0.55)]";
  }

  return "bg-neon-cell/70";
}

export const GameBoard: FC<GameBoardProps> = ({
  board,
  state,
  foodFadeInMs,
  maximumSizePx,
}) => {
  const cells = createBoardCells(board, state).map(({ intent, key }) => (
    <span
      aria-hidden="true"
      className={`min-h-0 min-w-0 border border-neon-grid/25 ${deriveCellClassName(intent)}`}
      key={key}
    />
  ));

  return (
    <div
      aria-label={`Snake game board, ${board.width} columns by ${board.height} rows`}
      className="grid overflow-hidden rounded-2xl border border-neon-violet/60 bg-neon-board p-1 shadow-[0_0_25px_rgba(139,92,246,0.2),inset_0_0_30px_rgba(34,211,238,0.04)]"
      role="img"
      style={
        {
          "--food-fade-in-ms": `${foodFadeInMs}ms`,
          aspectRatio: `${board.width} / ${board.height}`,
          gridTemplateColumns: `repeat(${board.width}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${board.height}, minmax(0, 1fr))`,
          maxWidth: `${maximumSizePx}px`,
          width: `min(92vw, calc((100vh - 14rem) * ${board.width / board.height}), ${maximumSizePx}px)`,
        } as CSSProperties
      }
    >
      {cells}
    </div>
  );
};
