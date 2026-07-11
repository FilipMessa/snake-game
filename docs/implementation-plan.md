# Implementation Plan

**Status:** Core game and browser audio implemented. Continuous life-loss recovery is implemented in Phase 6.

Implementation proceeds in vertical TDD slices. Within each capability, write one failing behavior test, add only enough production code to pass, and repeat. Tests exercise the agreed public seams rather than private helpers.

## Phase 1: Foundation

1. Scaffold Vite with React and TypeScript.
2. Add Tailwind's Vite plugin, Vitest, React Testing Library, jsdom, ESLint, and Prettier.
3. Define npm scripts for development, tests, type-checking, linting, formatting, and production builds.
4. Add feature-first folders, domain types, structured configuration, and shared logging files.

## Phase 2: Domain TDD

1. Create a deterministic initial state through `createGameState`.
2. Reject invalid configuration with `GameConfigurationError`.
3. Implement ready-to-active direction handling and reversal rejection.
4. Advance one cell per tick and buffer at most one turn.
5. Implement food consumption, one-segment growth, scoring, and deterministic respawning.
6. Derive configurable tick duration and displayed speed level.
7. Implement wall and self-collisions, legal tail-cell entry, lives, and recovery.
8. Implement game over, Enter restart, and full-board completion.

## Phase 3: React Integration

1. Build `useGameLoop` with `requestAnimationFrame`, cleanup, and background recovery.
2. Build `useGameController` for keyboard input, domain transitions, and error handling.
3. Add focused integration tests without duplicating domain-rule coverage.

## Phase 4: Presentation

1. Render the board, status panel, and overlays as React DOM elements.
2. Apply the neon Tailwind theme and responsive square layout.
3. Add food fade, life-loss feedback, reduced-motion behavior, and accessibility status text.

## Phase 5: Browser Audio

This phase implements [ADR 028](./adr/028-browser-audio-architecture.md) without changing the pure `GameService` seam. Work in vertical TDD slices: make a transition-to-cue behavior fail first, then add only the audio implementation required to satisfy it.

1. Add `GameAudioCueService.ts` with the single pure public seam:

   ```ts
   deriveAudioCues(previous: GameState, next: GameState): ReadonlyArray<GameAudioCue>;
   ```

   Add `GameAudioCueService.test.ts` first. Cover start/resume, food, food-plus-level-up ordering, life loss, terminal game over, victory, and the silent transitions. In particular, verify that terminal outcomes replace food/collision cues rather than layering them.

2. Add the private browser playback implementation in `GameAudioPlayer.ts`. Centralize asset paths, preload the selected OGG files, permit the food-plus-level-up overlap, loop `slampe.ogg`, and ensure pause/reset/disposal behavior is idempotent. Catch `HTMLAudioElement.play()` rejections; log through `LoggerService` without changing game state or surfacing an error overlay.

3. Add `hooks/useGameAudio.ts` as the React seam. It receives committed `GameState`, retains the previous snapshot, forwards pure cues to the player after commit, and owns one-time capture-phase `keydown`/`pointerdown` activation handling. It must not add audio state or browser calls to `GameService` or `useGameController`.

4. Implement music lifecycle in the hook/player: play or resume only while status is `active`; continue through nonterminal life loss; stop and reset at game over or victory. Effects and music default to enabled.

5. Add resilient local preference persistence for independent `musicEnabled` and `effectsEnabled` values. Treat missing, malformed, unavailable, or throwing browser storage as the enabled defaults. Keep persistence details behind `useGameAudio`; callers receive only preferences and toggle callbacks.

6. Add `AudioControls.tsx`, with two visible, keyboard-accessible controls and clear labels for Music and Effects. The controls are silent. Compose it in `Game.tsx` beside the status information, and pass only the small `useGameAudio` interface that the controls need.

7. Add focused React tests for the controls and hook integration. Mock only browser media and storage boundaries. Verify persisted preference restoration, independent toggles, cleanup, and that playback failures do not interrupt gameplay. Do not duplicate `GameService` rule coverage.

8. Perform manual browser verification: first keyboard interaction unlocks audio; each accepted event produces its intended cue once; food plus level-up overlap cleanly; life loss keeps music playing; terminal outcomes stop it; reload restores settings; keyboard game controls and accessibility text remain intact.

## Phase 6: Continuous Life-Loss Recovery

This phase implements [ADR 029](./adr/029-continuous-life-loss-recovery.md) through the approved `transitionGame`, `Game`, and `deriveAudioCues` seams.

1. Replace reset-on-collision recovery with active-state preservation of the snake, food, direction, score, progress, and speed.
2. Add a collision lock so repeated blocked ticks deduct only one life, then clear that lock after a successful move.
3. Keep final-life collision terminal while preserving the snake's last valid cells.
4. Move life-loss feedback from the overlay to a 260 millisecond snake-only blink, with reduced-motion suppression and a polite live-region announcement.
5. Derive the life-loss cue from an active-to-active life decrement and keep background music synchronized with active play.
6. Update the ADRs, glossary, architecture state model, README behavior, and focused public-seam tests.

## Completion Gate

Run the full test suite, TypeScript check, ESLint, Prettier check, and production build. Review the result against every accepted ADR and manually verify keyboard controls, speed changes, all terminal states, responsive layout, Strict Mode cleanup, browser audio activation, audio preference restoration, and silent-degradation behavior.
