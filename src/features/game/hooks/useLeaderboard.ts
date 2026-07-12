import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { BROWSER_STORAGE } from "../BrowserLeaderboardStorage";
import type { GameState, GameStatus } from "../Game.types";
import {
  recordLeaderboardResult,
  type LeaderboardEntry,
} from "../LeaderboardService";

export type LeaderboardPresentation = Readonly<{
  currentEntry: LeaderboardEntry | null;
  currentEntryRef: RefObject<HTMLTableRowElement | null>;
  entries: ReadonlyArray<LeaderboardEntry>;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}>;

export type UseLeaderboardResult = Readonly<{
  clearCurrentEntry: () => void;
  presentation: LeaderboardPresentation;
}>;

function isTerminalStatus(status: GameStatus): boolean {
  return status === "game-over" || status === "completed";
}

export function useLeaderboard(
  state: GameState,
  playerName: string | null,
  maximumEntries: number,
): UseLeaderboardResult {
  const [entries, setEntries] = useState(() =>
    BROWSER_STORAGE.load(maximumEntries),
  );
  const [currentEntry, setCurrentEntry] = useState<LeaderboardEntry | null>(
    null,
  );
  const currentEntryRef = useRef<HTMLTableRowElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousStatusRef = useRef(state.status);
  const clearCurrentEntry = useCallback((): void => {
    setCurrentEntry(null);
  }, []);

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
    setCurrentEntry(updatedEntries.includes(result) ? result : null);
    BROWSER_STORAGE.save(updatedEntries);
  }, [entries, maximumEntries, playerName, state.score, state.status]);

  useEffect(() => {
    if (playerName === null || state.status === "ready") {
      if (scrollContainerRef.current !== null) {
        scrollContainerRef.current.scrollTop = 0;
      }
      return;
    }

    if (currentEntry !== null) {
      currentEntryRef.current?.scrollIntoView?.({ block: "nearest" });
    }
  }, [currentEntry, playerName, state.status]);

  return {
    clearCurrentEntry,
    presentation: {
      currentEntry,
      currentEntryRef,
      entries,
      scrollContainerRef,
    },
  };
}
