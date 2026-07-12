import type { FC } from "react";

import { UI_CONFIG } from "./Game.config";
import type { GameDependencies } from "./Game.types";
import { GameBoard } from "./GameBoard";
import { LiveMessage } from "./LiveMessage";
import { GameOverlay } from "./GameOverlay";
import { PlayerPanel } from "./PlayerPanel";
import { ScorePanel } from "./ScorePanel";
import { AudioControls } from "./AudioControls";
import { useGameController } from "./hooks/useGameController";

interface GameProps {
  readonly dependencies: GameDependencies;
}

export const Game: FC<GameProps> = ({ dependencies }) => {
  const {
    audio,
    boardAreaRef,
    boardCells,
    canChangePlayer,
    changePlayer,
    isCollisionLocked,
    isNarrowBoard,
    leaderboard,
    playerName,
    state,
    submitPlayer,
  } = useGameController(dependencies);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-6 text-white">
      <header className="w-full max-w-[640px]">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-neon-cyan sm:text-xs">
              Arcade protocol
            </p>
            <h1 className="text-2xl font-black uppercase tracking-[0.12em] sm:text-3xl">
              Neon Snake
            </h1>
          </div>
          <p className="hidden font-mono text-[10px] uppercase tracking-wider text-neon-muted sm:block">
            Arrows / WASD
          </p>
        </div>
        <div className="mb-3 flex justify-end">
          <AudioControls
            effectsEnabled={audio.preferences.effectsEnabled}
            musicEnabled={audio.preferences.musicEnabled}
            onToggleEffects={audio.toggleEffects}
            onToggleMusic={audio.toggleMusic}
          />
        </div>
        {playerName !== null && (
          <PlayerPanel
            canChange={canChangePlayer}
            onChange={changePlayer}
            playerName={playerName}
          />
        )}
        <ScorePanel
          lives={state.lives}
          score={state.score}
          speedLevel={state.speedLevel}
        />
      </header>

      <section aria-label="Game area" className="relative" ref={boardAreaRef}>
        <GameBoard
          board={dependencies.config.board}
          cells={boardCells}
          foodFadeInMs={UI_CONFIG.animation.foodFadeInMs}
          lifeLossPulseMs={UI_CONFIG.animation.lifeLossPulseMs}
          maximumSizePx={UI_CONFIG.board.maximumSizePx}
          minimumSizePx={UI_CONFIG.board.minimumSizePx}
          isCollisionLocked={isCollisionLocked}
        />
        <GameOverlay
          isPlayerFormOpen={playerName === null}
          isNarrowBoard={isNarrowBoard}
          leaderboard={leaderboard}
          maximumPlayerNameLength={
            UI_CONFIG.leaderboard.maximumPlayerNameLength
          }
          onSubmitPlayer={submitPlayer}
          state={state}
        />
      </section>

      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon-muted sm:text-xs">
        Eat the pulse · Avoid the grid ·{" "}
        {dependencies.config.session.initialLives} lives
      </p>
      <LiveMessage state={state} />
    </main>
  );
};
