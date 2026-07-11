# ADR 002: Collisions and Lives

## Status

Accepted

The life-loss recovery decision is superseded by [ADR 029](./029-continuous-life-loss-recovery.md).

## Context

The board and snake body need meaningful collision rules, but a single mistake should not immediately end the entire run.

## Decision

Each run begins with three lives. Contact with a wall or the snake's own body consumes one life. A single collision can consume at most one life. The run ends when a collision leaves the player with zero lives.

Moving into the cell currently occupied by the tail is legal when a normal movement tick removes that tail. It is a self-collision when food consumption causes the tail to remain in place during the same tick.

The original recovery decision reset the snake to its initial length and center position. ADR 029 replaces that behavior with continuous active play that preserves the snake.

## Consequences

- The interface must display remaining lives.
- Game state distinguishes a life loss from the end of a run.
- Collision handling must prevent repeated life loss from a single impact.
- Score and snake length belong to the run.
- Self-collision uses the occupancy that remains after accounting for whether the tail moves.
