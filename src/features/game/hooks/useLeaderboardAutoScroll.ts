import { useEffect, useRef, type RefObject } from "react";

import type { GameStatus } from "../Game.types";
import type { LeaderboardEntry } from "../LeaderboardService";

export type UseLeaderboardAutoScrollResult = Readonly<{
  currentEntryRef: RefObject<HTMLTableRowElement | null>;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}>;

export function useLeaderboardAutoScroll(
  currentEntry: LeaderboardEntry | null,
  playerName: string | null,
  status: GameStatus,
): UseLeaderboardAutoScrollResult {
  const currentEntryRef = useRef<HTMLTableRowElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playerName === null || status === "ready") {
      if (scrollContainerRef.current !== null) {
        scrollContainerRef.current.scrollTop = 0;
      }
      return;
    }

    if (currentEntry !== null) {
      currentEntryRef.current?.scrollIntoView?.({ block: "nearest" });
    }
  }, [currentEntry, playerName, status]);

  return { currentEntryRef, scrollContainerRef };
}
