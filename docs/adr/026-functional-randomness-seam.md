# ADR 026: Functional Randomness Seam

## Status

Accepted

## Context

Food placement requires randomness, while domain tests require deterministic outcomes. A class hierarchy would add interface surface without adding behavior.

## Decision

Represent randomness as a function dependency:

```ts
type RandomSource = () => number;

type GameDependencies = Readonly<{
  config: GameConfig;
  random: RandomSource;
}>;
```

Production supplies `Math.random`. Tests supply deterministic closures with known sequences.

## Consequences

- Game service functions never create or access global randomness directly.
- Tests control food placement without mocking internal modules.
- No `BrowserRandom` or `SequenceRandom` classes are required.
