export type LeaderboardEntry = Readonly<{
  playerName: string;
  score: number;
  recordedAt: string;
}>;

export class LeaderboardValidationError extends Error {
  constructor() {
    super("Persisted leaderboard data is invalid.");
    this.name = "LeaderboardValidationError";
  }
}

function isLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<LeaderboardEntry>;

  return (
    typeof candidate.playerName === "string" &&
    candidate.playerName.length > 0 &&
    typeof candidate.score === "number" &&
    Number.isInteger(candidate.score) &&
    candidate.score >= 0 &&
    typeof candidate.recordedAt === "string" &&
    Number.isFinite(Date.parse(candidate.recordedAt))
  );
}

function compareLeaderboardEntries(
  left: LeaderboardEntry,
  right: LeaderboardEntry,
): number {
  const scoreDifference = right.score - left.score;

  if (scoreDifference !== 0) {
    return scoreDifference;
  }

  return Date.parse(right.recordedAt) - Date.parse(left.recordedAt);
}

export function recordLeaderboardResult(
  entries: ReadonlyArray<LeaderboardEntry>,
  result: LeaderboardEntry,
  maximumEntries: number,
): ReadonlyArray<LeaderboardEntry> {
  return [...entries, result]
    .sort(compareLeaderboardEntries)
    .slice(0, maximumEntries);
}

export function restoreLeaderboard(
  value: unknown,
  maximumEntries: number,
): ReadonlyArray<LeaderboardEntry> {
  if (!Array.isArray(value) || !value.every(isLeaderboardEntry)) {
    throw new LeaderboardValidationError();
  }

  return [...value].sort(compareLeaderboardEntries).slice(0, maximumEntries);
}
