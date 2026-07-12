import type { CSSProperties, FC } from "react";

import type { BoardCell } from "./GameBoardService";
import { deriveGameBoardCellClassName } from "./GameBoardViewService";
import type { GameConfig } from "./Game.types";

interface GameBoardProps {
  readonly board: GameConfig["board"];
  readonly cells: ReadonlyArray<BoardCell>;
  readonly isCollisionLocked: boolean;
  readonly foodFadeInMs: number;
  readonly lifeLossPulseMs: number;
  readonly maximumSizePx: number;
}

export const GameBoard: FC<GameBoardProps> = ({
  board,
  cells,
  isCollisionLocked,
  foodFadeInMs,
  lifeLossPulseMs,
  maximumSizePx,
}) => {
  const cellElements = cells.map(({ intent, key }) => (
    <span
      aria-hidden="true"
      className={`min-h-0 min-w-0 border border-neon-grid/25 ${deriveGameBoardCellClassName(intent, isCollisionLocked)}`}
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
          "--life-loss-pulse-ms": `${lifeLossPulseMs}ms`,
          aspectRatio: `${board.width} / ${board.height}`,
          gridTemplateColumns: `repeat(${board.width}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${board.height}, minmax(0, 1fr))`,
          maxWidth: `${maximumSizePx}px`,
          width: `min(92vw, calc((100vh - 14rem) * ${board.width / board.height}), ${maximumSizePx}px)`,
        } as CSSProperties
      }
    >
      {cellElements}
    </div>
  );
};
