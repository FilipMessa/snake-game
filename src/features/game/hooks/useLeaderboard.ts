import { useEffect, useRef, useState } from "react";

import { BROWSER_STORAGE } from "../BrowserLeaderboardStorage";
import type { GameState, GameStatus } from "../Game.types";
import {
  recordLeaderboardResult,
  type LeaderboardEntry,
} from "../LeaderboardService";

function isTerminalStatus(status: GameStatus): boolean {
  return status === "game-over" || status === "completed";
}

export function useLeaderboard(
  state: GameState,
  playerName: string | null,
  maximumEntries: number,
): ReadonlyArray<LeaderboardEntry> {
  const [entries, setEntries] = useState(() =>
    BROWSER_STORAGE.load(maximumEntries),
  );
  const previousStatusRef = useRef(state.status);

  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    previousStatusRef.current = state.status;

    if (
      playerName === null ||
      isTerminalStatus(previousStatus) ||
      !isTerminalStatus(state.status)
    ) {
      return;
    }

    const result: LeaderboardEntry = {
      playerName,
      score: state.score,
      recordedAt: new Date().toISOString(),
    };

    const updatedEntries = recordLeaderboardResult(
      entries,
      result,
      maximumEntries,
    );

    setEntries(updatedEntries);
    BROWSER_STORAGE.save(updatedEntries);
  }, [entries, maximumEntries, playerName, state.score, state.status]);

  return entries;
}
