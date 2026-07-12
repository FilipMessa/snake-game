import type { BoardCellIntent } from "./GameBoardService";

function appendLifeLossClassName(
  className: string,
  isCollisionLocked: boolean,
): string {
  if (!isCollisionLocked) {
    return className;
  }

  return `${className} animate-snake-life-loss`;
}

export function deriveGameBoardCellClassName(
  intent: BoardCellIntent,
  isCollisionLocked: boolean,
): string {
  if (intent === "snake-head") {
    return appendLifeLossClassName(
      "z-10 rounded-[30%] bg-neon-cyan shadow-[0_0_12px_#22d3ee,0_0_24px_rgba(34,211,238,0.45)]",
      isCollisionLocked,
    );
  }

  if (intent === "snake-body") {
    return appendLifeLossClassName(
      "rounded-[28%] bg-neon-lime shadow-[0_0_9px_rgba(163,230,53,0.8)]",
      isCollisionLocked,
    );
  }

  if (intent === "food") {
    return "animate-food-in rounded-full bg-neon-magenta shadow-[0_0_12px_#f472b6,0_0_24px_rgba(244,114,182,0.55)]";
  }

  return "bg-neon-cell/70";
}
