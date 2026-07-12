import {
  restoreLeaderboard,
  type LeaderboardEntry,
} from "./LeaderboardService";

type ReportStorageError = (message: string, error: unknown) => void;
type BrowserStorage = Pick<Storage, "getItem" | "setItem">;

export interface LeaderboardStorage {
  load(maximumEntries: number): ReadonlyArray<LeaderboardEntry>;
  save(entries: ReadonlyArray<LeaderboardEntry>): void;
}

const LEADERBOARD_STORAGE_KEY = "neon-snake.leaderboard.v1";

export function createLeaderboardStorage(
  storage: BrowserStorage,
  reportError: ReportStorageError,
): LeaderboardStorage {
  let hasReportedLoadError = false;
  let hasReportedSaveError = false;

  return {
    load(maximumEntries) {
      try {
        const serializedEntries = storage.getItem(LEADERBOARD_STORAGE_KEY);

        if (serializedEntries === null) {
          return [];
        }

        return restoreLeaderboard(
          JSON.parse(serializedEntries),
          maximumEntries,
        );
      } catch (error) {
        if (!hasReportedLoadError) {
          reportError("Unable to load the leaderboard.", error);
          hasReportedLoadError = true;
        }

        return [];
      }
    },
    save(entries) {
      try {
        storage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
      } catch (error) {
        if (!hasReportedSaveError) {
          reportError("Unable to save the leaderboard.", error);
          hasReportedSaveError = true;
        }
      }
    },
  };
}
