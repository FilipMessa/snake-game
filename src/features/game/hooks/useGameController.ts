import { useCallback, useEffect, useState } from "react";

import { UI_CONFIG } from "../Game.config";
import { createBoardCells, type BoardCell } from "../GameBoardService";
import type { LeaderboardEntry } from "../LeaderboardService";
import { resolvePlayerName } from "../PlayerNameService";
import { createGameState, transitionGame } from "../GameService";
import type {
  Direction,
  GameDependencies,
  GameEvent,
  GameState,
} from "../Game.types";
import { useGameAudio, type UseGameAudioResult } from "./useGameAudio";
import { useLeaderboard } from "./useLeaderboard";
import { useGameLoop } from "./useGameLoop";

export type UseGameControllerResult = Readonly<{
  audio: UseGameAudioResult;
  boardCells: ReadonlyArray<BoardCell>;
  changePlayer: () => void;
  isCollisionLocked: boolean;
  leaderboardEntries: ReadonlyArray<LeaderboardEntry>;
  playerName: string | null;
  state: GameState;
  submitPlayer: (input: string) => void;
}>;

const DIRECTION_BY_KEY: Readonly<Record<string, Direction>> = {
  arrowup: "up",
  w: "up",
  arrowdown: "down",
  s: "down",
  arrowleft: "left",
  a: "left",
  arrowright: "right",
  d: "right",
};

export function useGameController(
  dependencies: GameDependencies,
): UseGameControllerResult {
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [state, setState] = useState(() => createGameState(dependencies));
  const inputEnabled = playerName !== null;
  const isCollisionLocked = state.status === "active" && state.collisionLocked;
  const boardCells = createBoardCells(dependencies.config.board, state);
  const leaderboardEntries = useLeaderboard(
    state,
    playerName,
    UI_CONFIG.leaderboard.maximumEntries,
  );
  const audio = useGameAudio(state);

  const dispatch = useCallback(
    (event: GameEvent): void => {
      setState((current) => transitionGame(current, event, dependencies));
    },
    [dependencies],
  );

  useEffect(() => {
    if (!inputEnabled) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      const normalizedKey = event.key.toLowerCase();
      const direction = DIRECTION_BY_KEY[normalizedKey];

      if (direction !== undefined) {
        event.preventDefault();
        dispatch({ type: "direction", direction });
        return;
      }

      if (normalizedKey === "enter") {
        event.preventDefault();
        dispatch({ type: "restart" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, inputEnabled]);

  useGameLoop({
    isRunning: inputEnabled && state.status === "active",
    tickMs: state.tickMs,
    onTick: () => dispatch({ type: "tick" }),
  });

  const submitPlayer = useCallback(
    (input: string): void => {
      dispatch({ type: "restart" });
      setPlayerName(
        resolvePlayerName(
          input,
          UI_CONFIG.leaderboard.maximumPlayerNameLength,
          dependencies.random,
        ),
      );
    },
    [dependencies.random, dispatch],
  );

  const changePlayer = useCallback((): void => {
    setPlayerName(null);
  }, []);

  return {
    audio,
    boardCells,
    changePlayer,
    isCollisionLocked,
    leaderboardEntries,
    playerName,
    state,
    submitPlayer,
  };
}
