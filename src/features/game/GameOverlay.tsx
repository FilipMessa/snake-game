import type { FC, ReactNode } from "react";

import type { GameState } from "./Game.types";
import { Leaderboard } from "./Leaderboard";
import { PlayerNameForm } from "./PlayerNameForm";
import type { LeaderboardPresentation } from "./hooks/useLeaderboard";

interface GameOverlayProps {
  readonly isPlayerFormOpen: boolean;
  readonly isNarrowBoard: boolean;
  readonly leaderboard: LeaderboardPresentation;
  readonly maximumPlayerNameLength: number;
  readonly onSubmitPlayer: (input: string) => void;
  readonly state: GameState;
}

export const GameOverlay: FC<GameOverlayProps> = ({
  isPlayerFormOpen,
  isNarrowBoard,
  leaderboard,
  maximumPlayerNameLength,
  onSubmitPlayer,
  state,
}) => {
  let actionContent: ReactNode;

  if (isPlayerFormOpen) {
    actionContent = (
      <PlayerNameForm
        isCompact={isNarrowBoard}
        maximumLength={maximumPlayerNameLength}
        onSubmit={onSubmitPlayer}
      />
    );
  } else {
    if (state.status === "active") {
      return null;
    }

    const content = {
      ready: {
        eyebrow: "System ready",
        title: "Ready?",
        instruction: "Use arrow keys or WASD to launch",
      },
      "game-over": {
        eyebrow: "Signal lost",
        title: "Game Over",
        instruction: "Press Enter to restart",
      },
      completed: {
        eyebrow: "Grid conquered",
        title: "You Win",
        instruction: "Press Enter to restart",
      },
    }[state.status];

    actionContent = (
      <div
        className={`shrink-0 rounded-2xl border border-neon-violet/50 bg-neon-panel/90 shadow-[0_0_35px_rgba(139,92,246,0.25)] ${isNarrowBoard ? "px-3 py-2" : "px-6 py-4"}`}
      >
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-neon-cyan">
          {content.eyebrow}
        </p>
        <h2
          className={`${isNarrowBoard ? "mt-1 text-2xl" : "mt-2 text-3xl sm:text-4xl"} font-black uppercase tracking-wider text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]`}
        >
          {content.title}
        </h2>
        {state.status !== "ready" && (
          <p
            className={`${isNarrowBoard ? "mt-1" : "mt-2"} font-mono text-sm text-neon-lime`}
          >
            Final score: {state.score}
          </p>
        )}
        <p
          className={`${isNarrowBoard ? "mt-2" : "mt-4"} font-mono text-xs uppercase tracking-wider text-neon-muted sm:text-sm`}
        >
          {content.instruction}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-1 flex min-h-0 flex-col overflow-hidden rounded-xl bg-neon-ink/78 text-center backdrop-blur-[2px] ${isNarrowBoard ? "gap-2 p-2" : "gap-4 p-4 sm:p-6"}`}
    >
      {actionContent}
      <Leaderboard
        {...leaderboard}
        isCompact={isNarrowBoard}
        showDate={!isNarrowBoard}
      />
    </div>
  );
};
