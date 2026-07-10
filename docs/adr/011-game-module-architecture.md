# ADR 011: Event-Driven Game Module

## Status

Superseded by ADR 013

## Context

This training project prioritizes clear architecture, deterministic testing, and zero runtime dependencies.

## Proposed Decision

Place all domain state and rules behind a `Game` interface with two operations: `snapshot()` and `dispatch(event)`. Implement it as `SnakeGame`, configured at creation and supplied with a `RandomSource` adapter. Keep keyboard input, tick scheduling, and DOM rendering outside the module and coordinate them in `GameApplication`.

Use a real randomness seam with a browser adapter and a deterministic test adapter. Do not introduce interfaces for browser collaborators until multiple implementations exist.

## Consequences

- Domain tests use the same small interface as production callers.
- Timing, input, and presentation cannot contaminate game rules.
- The immutable snapshot is the only rendering model.
- `GameApplication` owns orchestration but no gameplay decisions.

## Supersession

The stateful `Game` object was replaced by pure functions in `GameService.ts`, with React effects coordinated by `useGameController`.
