import { logError } from "../../shared/logger/LoggerService";
import { createLeaderboardStorage } from "./LeaderboardStorage";

const LOCAL_STORAGE = {
  getItem(key: string): string | null {
    return window.localStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  },
};

export const BROWSER_STORAGE = createLeaderboardStorage(
  LOCAL_STORAGE,
  logError,
);
