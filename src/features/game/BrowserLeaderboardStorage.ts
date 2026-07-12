import { logError } from "../../shared/logger/LoggerService";
import { BROWSER_STORAGE } from "./BrowserStorage";
import { createLeaderboardStorage } from "./LeaderboardStorage";

export const BROWSER_LEADERBOARD_STORAGE = createLeaderboardStorage(
  BROWSER_STORAGE,
  logError,
);
