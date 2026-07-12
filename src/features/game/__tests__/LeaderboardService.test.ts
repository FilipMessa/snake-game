import { describe, expect, it } from "vitest";

import {
  LeaderboardValidationError,
  recordLeaderboardResult,
  restoreLeaderboard,
  type LeaderboardEntry,
} from "../LeaderboardService";

describe("LeaderboardService", () => {
  describe("recordLeaderboardResult", () => {
    it("returns entries ordered by descending score", () => {
      const entries: ReadonlyArray<LeaderboardEntry> = [
        {
          playerName: "Grace",
          score: 20,
          recordedAt: "2026-07-10T12:00:00.000Z",
        },
      ];
      const result: LeaderboardEntry = {
        playerName: "Ada",
        score: 40,
        recordedAt: "2026-07-11T12:00:00.000Z",
      };
      const maximumEntries = 10;

      const leaderboard = recordLeaderboardResult(
        entries,
        result,
        maximumEntries,
      );

      expect(leaderboard).toEqual([result, entries[0]]);
    });

    it("keeps duplicate names and orders score ties by newest result", () => {
      const older: LeaderboardEntry = {
        playerName: "Ada",
        score: 40,
        recordedAt: "2026-07-10T12:00:00.000Z",
      };
      const newer: LeaderboardEntry = {
        playerName: "Ada",
        score: 40,
        recordedAt: "2026-07-11T12:00:00.000Z",
      };
      const entries = [older];
      const maximumEntries = 10;

      const leaderboard = recordLeaderboardResult(
        entries,
        newer,
        maximumEntries,
      );

      expect(leaderboard).toEqual([newer, older]);
    });

    it("returns no more than the configured number of best entries", () => {
      const best: LeaderboardEntry = {
        playerName: "Ada",
        score: 20,
        recordedAt: "2026-07-11T10:00:00.000Z",
      };
      const lowest: LeaderboardEntry = {
        playerName: "Grace",
        score: 10,
        recordedAt: "2026-07-11T09:00:00.000Z",
      };
      const result: LeaderboardEntry = {
        playerName: "Linus",
        score: 30,
        recordedAt: "2026-07-11T11:00:00.000Z",
      };
      const entries = [best, lowest];
      const maximumEntries = 2;

      const leaderboard = recordLeaderboardResult(
        entries,
        result,
        maximumEntries,
      );

      expect(leaderboard).toEqual([result, best]);
    });
  });

  describe("restoreLeaderboard", () => {
    it("throws a typed error for an invalid persisted entry", () => {
      const persistedEntries: unknown = [
        {
          playerName: "Ada",
          score: "40",
          recordedAt: "2026-07-11T12:00:00.000Z",
        },
      ];
      const maximumEntries = 10;

      const restore = (): ReadonlyArray<LeaderboardEntry> =>
        restoreLeaderboard(persistedEntries, maximumEntries);

      expect(restore).toThrow(LeaderboardValidationError);
      expect(restore).toThrow("Persisted leaderboard data is invalid.");
    });
  });
});
