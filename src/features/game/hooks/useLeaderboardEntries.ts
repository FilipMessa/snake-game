import { useCallback, useEffect, useRef, useState } from "react";

import { BROWSER_LEADERBOARD_STORAGE } from "../BrowserLeaderboardStorage";
import type { GameState } from "../Game.types";
import {
  recordCompletedRun,
  type LeaderboardEntry,
} from "../LeaderboardService";

export type UseLeaderboardEntriesResult = Readonly<{
  clearCurrentEntry(): void;
  currentEntry: LeaderboardEntry | null;
  entries: ReadonlyArray<LeaderboardEntry>;
}>;

export function useLeaderboardEntries(
  state: GameState,
  playerName: string | null,
  maximumEntries: number,
): UseLeaderboardEntriesResult {
  const [entries, setEntries] = useState(() =>
    BROWSER_LEADERBOARD_STORAGE.load(maximumEntries),
  );
  const [currentEntry, setCurrentEntry] = useState<LeaderboardEntry | null>(
    null,
  );
  const previousStatusRef = useRef(state.status);
  const clearCurrentEntry = useCallback((): void => {
    setCurrentEntry(null);
  }, []);

  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    previousStatusRef.current = state.status;
    const outcome = recordCompletedRun(
      entries,
      {
        playerName,
        previousStatus,
        recordedAt: new Date().toISOString(),
        score: state.score,
        status: state.status,
      },
      maximumEntries,
    );

    if (!outcome.didRecord) {
      return;
    }

    setEntries(outcome.entries);
    setCurrentEntry(outcome.recordedEntry);
    BROWSER_LEADERBOARD_STORAGE.save(outcome.entries);
  }, [entries, maximumEntries, playerName, state.score, state.status]);

  return { clearCurrentEntry, currentEntry, entries };
}
