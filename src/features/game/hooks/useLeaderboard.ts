import type { RefObject } from "react";

import type { GameState } from "../Game.types";
import type { LeaderboardEntry } from "../LeaderboardService";
import { useLeaderboardAutoScroll } from "./useLeaderboardAutoScroll";
import { useLeaderboardEntries } from "./useLeaderboardEntries";

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

export function useLeaderboard(
  state: GameState,
  playerName: string | null,
  maximumEntries: number,
): UseLeaderboardResult {
  const leaderboardEntries = useLeaderboardEntries(
    state,
    playerName,
    maximumEntries,
  );
  const autoScroll = useLeaderboardAutoScroll(
    leaderboardEntries.currentEntry,
    playerName,
    state.status,
  );

  return {
    clearCurrentEntry: leaderboardEntries.clearCurrentEntry,
    presentation: {
      currentEntry: leaderboardEntries.currentEntry,
      currentEntryRef: autoScroll.currentEntryRef,
      entries: leaderboardEntries.entries,
      scrollContainerRef: autoScroll.scrollContainerRef,
    },
  };
}
