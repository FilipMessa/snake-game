# ADR 014: Domain Test Seam

## Status

Accepted

## Context

TDD requires a stable public seam so tests describe observable behavior without coupling to helper functions or implementation structure.

## Decision

Domain tests exercise exactly two public functions from `GameService.ts`:

```ts
createGameState(dependencies): GameState
transitionGame(state, event, dependencies): GameState
```

Collision detection, food placement, scoring, speed calculation, and other helpers remain private implementation details. Tests verify their effects through returned `GameState` values. Randomness is controlled through the injected dependency.

## Consequences

- Refactoring private functions does not require rewriting behavioral tests.
- Each TDD cycle adds one failing behavior test and the smallest passing implementation.
- React integration tests use the hook or rendered UI seam and do not duplicate domain-rule tests.
- Internal call counts and helper invocation order are never asserted.
