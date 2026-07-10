# Implementation Plan

**Status:** Implemented and verified against the completion gate.

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

## Completion Gate

Run the full test suite, TypeScript check, ESLint, Prettier check, and production build. Review the result against every accepted ADR and manually verify keyboard controls, speed changes, all terminal states, responsive layout, and Strict Mode cleanup.
