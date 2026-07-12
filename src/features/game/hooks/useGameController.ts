import { useCallback, type RefObject } from "react";

import { UI_CONFIG } from "../Game.config";
import { createBoardCells, type BoardCell } from "../GameBoardService";
import type { GameDependencies, GameEvent, GameState } from "../Game.types";
import { useGameAudio, type UseGameAudioResult } from "./useGameAudio";
import { useGameSession } from "./useGameSession";
import { useLeaderboard, type LeaderboardPresentation } from "./useLeaderboard";
import { useGameLoop } from "./useGameLoop";
import { useKeyboardControls } from "./useKeyboardControls";
import { useNarrowBoard } from "./useNarrowBoard";
import { usePlayerSession } from "./usePlayerSession";

export type UseGameControllerResult = Readonly<{
  audio: UseGameAudioResult;
  boardAreaRef: RefObject<HTMLElement | null>;
  boardCells: ReadonlyArray<BoardCell>;
  canChangePlayer: boolean;
  changePlayer: () => void;
  isCollisionLocked: boolean;
  isNarrowBoard: boolean;
  leaderboard: LeaderboardPresentation;
  playerName: string | null;
  state: GameState;
  submitPlayer: (input: string) => void;
}>;

export function useGameController(
  dependencies: GameDependencies,
): UseGameControllerResult {
  const gameSession = useGameSession(dependencies);
  const playerSession = usePlayerSession(
    UI_CONFIG.leaderboard.maximumPlayerNameLength,
    dependencies.random,
  );
  const { state } = gameSession;
  const { playerName } = playerSession;
  const inputEnabled = playerName !== null;
  const canChangePlayer = state.status !== "active";
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

      gameSession.dispatch(event);
    },
    [clearCurrentLeaderboardEntry, gameSession],
  );

  useKeyboardControls({ enabled: inputEnabled, onEvent: dispatch });

  useGameLoop({
    isRunning: inputEnabled && state.status === "active",
    tickMs: state.tickMs,
    onTick: () => dispatch({ type: "tick" }),
  });

  const submitPlayer = useCallback(
    (input: string): void => {
      dispatch({ type: "restart" });
      playerSession.selectPlayer(input);
    },
    [dispatch, playerSession],
  );

  const changePlayer = useCallback((): void => {
    clearCurrentLeaderboardEntry();
    playerSession.clearPlayer();
  }, [clearCurrentLeaderboardEntry, playerSession]);

  return {
    audio,
    boardAreaRef: boardPresentation.boardAreaRef,
    boardCells,
    canChangePlayer,
    changePlayer,
    isCollisionLocked,
    isNarrowBoard: boardPresentation.isNarrowBoard,
    leaderboard: leaderboard.presentation,
    playerName,
    state,
    submitPlayer,
  };
}
