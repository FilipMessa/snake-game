# ADR 007: No Manual Pause

## Status

Accepted

The life-loss interruption decision is superseded by [ADR 029](./029-continuous-life-loss-recovery.md).

## Context

A pause action would add another control and runtime state to a deliberately simple game.

## Decision

Players cannot manually pause an active game. Once the snake begins moving, ticks continue through nonterminal collisions and stop only at game over or board completion.

## Consequences

- Space has no gameplay binding.
- The state model does not need a player-initiated paused state.
- The ready state is used only before the first movement of a new run.
