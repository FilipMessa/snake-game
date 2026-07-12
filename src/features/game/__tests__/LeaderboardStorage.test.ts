import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LeaderboardEntry } from "../LeaderboardService";
import { createLeaderboardStorage } from "../LeaderboardStorage";

describe("LeaderboardStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("createLeaderboardStorage", () => {
    it("returns entries previously saved in browser storage", () => {
      const entries: ReadonlyArray<LeaderboardEntry> = [
        {
          playerName: "Ada",
          score: 40,
          recordedAt: "2026-07-11T12:00:00.000Z",
        },
      ];
      const maximumEntries = 10;
      const reportError = vi.fn();
      const storage = createLeaderboardStorage(
        window.localStorage,
        reportError,
      );

      storage.save(entries);
      const restoredEntries = storage.load(maximumEntries);

      expect(restoredEntries).toEqual(entries);
      expect(reportError).not.toHaveBeenCalled();
    });

    it("returns an empty leaderboard and reports invalid data only once", () => {
      const maximumEntries = 10;
      const persistedValue = "{";
      const browserStorage = {
        getItem: vi.fn(() => persistedValue),
        setItem: vi.fn(),
      };
      const reportError = vi.fn();
      const storage = createLeaderboardStorage(browserStorage, reportError);

      const firstLoad = storage.load(maximumEntries);
      const secondLoad = storage.load(maximumEntries);

      expect(firstLoad).toEqual([]);
      expect(secondLoad).toEqual([]);
      expect(reportError).toHaveBeenCalledOnce();
      expect(reportError).toHaveBeenCalledWith(
        "Unable to load the leaderboard.",
        expect.any(SyntaxError),
      );
    });

    it("reports a browser write failure only once without throwing", () => {
      const entries: ReadonlyArray<LeaderboardEntry> = [
        {
          playerName: "Ada",
          score: 40,
          recordedAt: "2026-07-11T12:00:00.000Z",
        },
      ];
      const writeError = new Error("Storage is unavailable.");
      const browserStorage = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => {
          throw writeError;
        }),
      };
      const reportError = vi.fn();
      const storage = createLeaderboardStorage(browserStorage, reportError);

      const firstSave = (): void => storage.save(entries);
      const secondSave = (): void => storage.save(entries);

      expect(firstSave).not.toThrow();
      expect(secondSave).not.toThrow();
      expect(reportError).toHaveBeenCalledOnce();
      expect(reportError).toHaveBeenCalledWith(
        "Unable to save the leaderboard.",
        writeError,
      );
    });
  });
});
