import type { GameStatus } from "./Game.types";

export type LeaderboardEntry = Readonly<{
  playerName: string;
  score: number;
  recordedAt: string;
}>;

export type CompletedRunTransition = Readonly<{
  playerName: string | null;
  previousStatus: GameStatus;
  recordedAt: string;
  score: number;
  status: GameStatus;
}>;

export type RecordCompletedRunResult = Readonly<{
  didRecord: boolean;
  entries: ReadonlyArray<LeaderboardEntry>;
  recordedEntry: LeaderboardEntry | null;
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

function isTerminalStatus(status: GameStatus): boolean {
  return status === "game-over" || status === "completed";
}

export function recordCompletedRun(
  entries: ReadonlyArray<LeaderboardEntry>,
  transition: CompletedRunTransition,
  maximumEntries: number,
): RecordCompletedRunResult {
  if (
    transition.playerName === null ||
    isTerminalStatus(transition.previousStatus) ||
    !isTerminalStatus(transition.status)
  ) {
    return { didRecord: false, entries, recordedEntry: null };
  }

  const result: LeaderboardEntry = {
    playerName: transition.playerName,
    score: transition.score,
    recordedAt: transition.recordedAt,
  };
  const updatedEntries = recordLeaderboardResult(
    entries,
    result,
    maximumEntries,
  );

  return {
    didRecord: true,
    entries: updatedEntries,
    recordedEntry: updatedEntries.includes(result) ? result : null,
  };
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
