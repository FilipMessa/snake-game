import { useCallback, useEffect, useState, type RefObject } from "react";

import { UI_CONFIG } from "../Game.config";
import { createBoardCells, type BoardCell } from "../GameBoardService";
import { resolvePlayerName } from "../PlayerNameService";
import { createGameState, transitionGame } from "../GameService";
import type {
  Direction,
  GameDependencies,
  GameEvent,
  GameState,
} from "../Game.types";
import { useGameAudio, type UseGameAudioResult } from "./useGameAudio";
import { useLeaderboard, type LeaderboardPresentation } from "./useLeaderboard";
import { useGameLoop } from "./useGameLoop";
import { useNarrowBoard } from "./useNarrowBoard";

export type UseGameControllerResult = Readonly<{
  audio: UseGameAudioResult;
  boardAreaRef: RefObject<HTMLElement | null>;
  boardCells: ReadonlyArray<BoardCell>;
  changePlayer: () => void;
  isCollisionLocked: boolean;
  isNarrowBoard: boolean;
  leaderboard: LeaderboardPresentation;
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
  const leaderboard = useLeaderboard(
    state,
    playerName,
    UI_CONFIG.leaderboard.maximumEntries,
  );
  const clearCurrentLeaderboardEntry = leaderboard.clearCurrentEntry;
  const boardPresentation = useNarrowBoard(
    UI_CONFIG.leaderboard.narrowBoardThresholdPx,
  );
  const audio = useGameAudio(state);

  const dispatch = useCallback(
    (event: GameEvent): void => {
      if (event.type === "restart") {
        clearCurrentLeaderboardEntry();
      }

      setState((current) => transitionGame(current, event, dependencies));
    },
    [clearCurrentLeaderboardEntry, dependencies],
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
    clearCurrentLeaderboardEntry();
    setPlayerName(null);
  }, [clearCurrentLeaderboardEntry]);

  return {
    audio,
    boardAreaRef: boardPresentation.boardAreaRef,
    boardCells,
    changePlayer,
    isCollisionLocked,
    isNarrowBoard: boardPresentation.isNarrowBoard,
    leaderboard: leaderboard.presentation,
    playerName,
    state,
    submitPlayer,
  };
}
