# ADR 007: No Manual Pause

## Status

Accepted

## Context

A pause action would add another control and runtime state to a deliberately simple game.

## Decision

Players cannot manually pause an active game. Once the snake begins moving, ticks continue until a collision, game over, or board-completion condition interrupts play.

## Consequences

- Space has no gameplay binding.
- The state model does not need a player-initiated paused state.
- The ready state after life loss is not considered a pause; movement has not restarted yet.
