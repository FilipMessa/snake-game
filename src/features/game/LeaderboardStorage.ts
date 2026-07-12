import {
  restoreLeaderboard,
  type LeaderboardEntry,
} from "./LeaderboardService";
import {
  createJsonStorage,
  type JsonStorage,
  type KeyValueStorage,
  type ReportStorageError,
} from "./JsonStorage";

export type LeaderboardStorage = JsonStorage<
  ReadonlyArray<LeaderboardEntry>,
  [maximumEntries: number]
>;

const LEADERBOARD_STORAGE_KEY = "neon-snake.leaderboard.v1";

export function createLeaderboardStorage(
  storage: KeyValueStorage,
  reportError: ReportStorageError,
): LeaderboardStorage {
  return createJsonStorage(storage, reportError, {
    defaultValue: [],
    key: LEADERBOARD_STORAGE_KEY,
    loadErrorMessage: "Unable to load the leaderboard.",
    restore(value, maximumEntries): ReadonlyArray<LeaderboardEntry> {
      return restoreLeaderboard(value, maximumEntries);
    },
    saveErrorMessage: "Unable to save the leaderboard.",
  });
}
