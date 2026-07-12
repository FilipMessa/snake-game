# ADR 030: Local Leaderboard

## Status

Accepted

Supersedes [ADR 017](./017-no-persistent-high-score.md).

## Context

The game needs a simple leaderboard without accounts, a backend, or cross-device synchronization. A player may provide a display name before play begins, and completed results must survive reloads in the same browser. Duplicate player names are valid.

The design must preserve the pure gameplay module, keep browser persistence at an adapter seam, and avoid shallow abstractions that add interface without hiding meaningful behavior.

## Decision

The initial game screen presents an optional player-name form over the board. A provided name is trimmed, contains at most 20 characters, and otherwise permits ordinary Unicode text and symbols. Submitting an empty value generates a name in the `Player-1234` format through an explicitly supplied random source. The current player name lives only for the page session and is not persisted separately. Reloading the page asks for a name again and may generate a new one.

The header displays `Player: <name>` and offers `Change player` only while the game is ready or terminal. It is unavailable during active play. Changing player after a terminal outcome preserves the recorded result, opens the name form, and creates a new ready run after the form is submitted.

Every run that reaches `game-over` or `completed`, including a zero-point run, is considered for the leaderboard exactly once. A leaderboard entry contains:

- the player name;
- the final score;
- a precise ISO recording timestamp.

The leaderboard retains only the best ten entries. Entries are ordered by descending score and then by descending recording timestamp, so a newer entry wins a score tie. Identical player names remain independent entries. The UI displays the timestamp as `DD.MM.YYYY` without the time.

The leaderboard is always rendered below the board with rank, player name, score, and date columns, plus an empty state when no entry exists. The UI remains in English. There is no leaderboard-clear control, consent banner, or storage information message.

The implementation separates four cohesive responsibilities:

1. A pure player-name module owns normalization, length validation, and fallback generation behind one small interface. Randomness is supplied explicitly.
2. A pure leaderboard module owns terminal-transition eligibility, entry creation and validation, recording, ordering, highlighting eligibility, and the ten-entry limit behind a small interface.
3. A leaderboard persistence module owns the versioned key and domain restoration. A feature-local JSON storage module owns serialization, key-value I/O, and report-once error handling shared with audio preferences; the browser adapter supplies `localStorage` and logging. This concrete mechanism is not a generic repository port.
4. A thin React facade composes one hook for the record-results use case with one hook for leaderboard auto-scroll presentation. The results hook owns React state and lifecycle, delegates terminal-transition decisions to the pure leaderboard module, and composes it with the storage adapter. The auto-scroll hook owns only refs and DOM scrolling. Neither moves leaderboard concerns into `GameService`.

If browser storage is unavailable or contains invalid data, the game continues with an empty in-memory leaderboard. New results remain usable until reload, and the non-fatal platform failure is logged once through the existing logging seam.

All tunable values, including the ten-entry limit and maximum player-name length, live in `Game.config.ts`.

## Consequences

- The leaderboard is local to one browser profile and device.
- Clearing site data removes all leaderboard entries.
- Scores that do not remain in the best ten are discarded without a separate notification.
- Pure leaderboard behavior is testable without React or browser storage.
- Storage failures cannot prevent gameplay.
- `GameService` and `GameState` remain focused on gameplay transitions.
