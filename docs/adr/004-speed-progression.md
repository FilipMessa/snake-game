# ADR 004: Speed Progression

## Status

Accepted

## Context

Snake length increases spatial difficulty, but the game should also become faster as the player succeeds.

## Decision

Movement starts at 180 milliseconds per tick. After every five consumed food items (50 points), the tick duration decreases by 10 milliseconds, down to a minimum of 80 milliseconds. Life loss does not reset the achieved speed because score and overall run progress are preserved.

These values live in structured immutable configuration rather than as literals inside game logic:

```ts
speed: {
  initialTickMs: 180,
  minimumTickMs: 80,
  progression: {
    initialLevel: 1,
    foodsPerLevel: 5,
    tickReductionMs: 10,
  },
}
```

The service derives both current tick duration and displayed speed level from this structure. The level is capped when the minimum tick duration is reached.

## Consequences

- Tick duration is derived from run progress rather than current snake length.
- Speed progression must have a lower duration bound to remain playable.
- The interface may communicate speed changes, but no indicator is currently required.
- Future balancing changes should require editing configuration, not movement logic.
- The status panel displays the derived level rather than raw milliseconds.
