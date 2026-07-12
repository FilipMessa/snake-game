# ADR 017: No Persistent High Score in Version One

## Status

Accepted

Superseded by [ADR 030](./030-local-leaderboard.md).

## Context

Persisting scores would introduce browser storage, migration behavior, and another adapter seam before the core game is complete.

## Decision

Version one displays only the current run score. It does not persist a high score between runs, reloads, or browser sessions.

## Consequences

- `GameState` needs only the current score.
- No local-storage code or storage tests are required in version one.
- A later iteration may introduce a `HighScoreRepository` seam and local-storage adapter as an independent architecture exercise.
