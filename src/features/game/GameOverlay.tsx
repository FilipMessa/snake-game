import type { FC } from "react";

import type { GameState } from "./Game.types";

interface GameOverlayProps {
  readonly state: GameState;
}

export const GameOverlay: FC<GameOverlayProps> = ({ state }) => {
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
  return (
    <div className="absolute inset-1 grid place-items-center rounded-xl bg-neon-ink/78 p-6 text-center backdrop-blur-[2px]">
      <div className="max-w-sm rounded-2xl border border-neon-violet/50 bg-neon-panel/90 px-6 py-5 shadow-[0_0_35px_rgba(139,92,246,0.25)]">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-neon-cyan">
          {content.eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-black uppercase tracking-wider text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] sm:text-4xl">
          {content.title}
        </h2>
        {state.status !== "ready" && (
          <p className="mt-2 font-mono text-sm text-neon-lime">
            Final score: {state.score}
          </p>
        )}
        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-neon-muted sm:text-sm">
          {content.instruction}
        </p>
      </div>
    </div>
  );
};
