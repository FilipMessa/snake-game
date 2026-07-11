# ADR 028: Browser Audio Architecture

## Status

Accepted

Supersedes [ADR 024](./024-audio-deferred.md).

## Context

The game now includes a selected CC0 music track and six CC0 electronic sound effects. Audio must respect browser user activation, offer independently persistent music and effects controls, and never affect gameplay when playback or loading fails.

The game domain currently exposes only `createGameState` and `transitionGame`. Adding audio events or browser concerns to that domain seam would make pure gameplay tests and state transitions depend on presentation concerns.

## Decision

Derive semantic audio cues from consecutive committed `GameState` snapshots in a pure `GameAudioCueService` module. The cues are start, food eaten, level-up, life lost, game over, and victory. Normal ticks, turns, food spawning, restart, and audio-control interactions are silent.

Use `useGameAudio` as the React seam. It owns the previous-state reference, one-time browser user-activation handling, persistent preferences, and cleanup. Its browser implementation uses preloaded `HTMLAudioElement` instances for the looped music track and short OGG effects. It catches playback failures and leaves the game playable.

Music and effects are independently enabled by default and persist their preferences locally. Music starts or resumes only while the game is active, pauses after life loss, and stops after game over or victory. Effects may overlap only for food consumption plus a speed level-up.

## Consequences

- `GameService.ts` remains pure and retains its approved two-function domain seam.
- `GameAudioCueService.ts` is the unit-test seam for transition-to-cue rules.
- Browser playback, user activation, storage, and failed media playback stay localized to the audio hook and its private implementation.
- Audio controls are presentation-only and use the hook's small returned interface.
- The game works silently if assets cannot load or a browser rejects playback.
