# ADR 022: Animation-Frame Game Loop

## Status

Accepted

## Context

Movement speed changes during a run. The browser integration needs one clear owner for timing without overlapping intervals or stale React closures.

## Decision

Create a reusable `useGameLoop` hook backed by `requestAnimationFrame`. It uses frame timestamps and a fixed-step accumulator to emit domain `tick` events at the current configured tick duration. It runs only while game status is `active` and cancels the latest frame during cleanup.

When the document becomes visible after background throttling, reset accumulated time so the snake does not execute catch-up moves. Dispatch at most one movement tick per animation frame.

Prefer modern, stable platform capabilities when they improve ownership or correctness. Do not choose an experimental API solely because it is newer.

## Consequences

- Timing is independent of display refresh rate.
- React Strict Mode cleanup cannot leave a duplicate loop running.
- Background tabs do not accumulate fatal movement bursts.
- `GameService.ts` remains unaware of browser time.
