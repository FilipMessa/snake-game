# ADR 020: Structured Domain and UI Configuration

## Status

Accepted

## Context

A flat configuration object mixes unrelated concepts, and presentation timing does not belong in the pure game domain.

## Decision

Use nested configuration grouped by ownership:

```ts
const DEFAULT_GAME_CONFIG = {
  board: { width: 20, height: 20 },
  session: { initialLives: 3 },
  snake: { initialLength: 3 },
  scoring: { pointsPerFood: 10 },
  speed: {
    initialTickMs: 180,
    minimumTickMs: 80,
    progression: {
      initialLevel: 1,
      foodsPerLevel: 5,
      tickReductionMs: 10,
    },
  },
} as const;

const UI_CONFIG = {
  animation: {
    foodFadeInMs: 150,
    lifeLossPulseMs: 260,
  },
  board: { maximumSizePx: 640 },
} as const;
```

Lives belong to `session`, not `snake`, because they persist when the snake resets. Neon colors belong in Tailwind theme tokens rather than TypeScript configuration.

## Consequences

- `GameService.ts` receives only `gameConfig` and domain dependencies.
- React hooks and components may consume `UI_CONFIG`.
- Runtime state never mutates either configuration.
