# ADR 002: Collisions and Lives

## Status

Accepted

## Context

The board and snake body need meaningful collision rules, but a single mistake should not immediately end the entire run.

## Decision

Each run begins with three lives. Contact with a wall or the snake's own body consumes one life. A single collision can consume at most one life. The run ends when a collision leaves the player with zero lives.

Moving into the cell currently occupied by the tail is legal when a normal movement tick removes that tail. It is a self-collision when food consumption causes the tail to remain in place during the same tick.

After a life loss, the score and current food are preserved. The snake resets to its initial length and center position, then remains in the ready state until the player presses a legal movement key. If the preserved food overlaps the reset snake, it is immediately relocated to a random unoccupied cell and uses the standard 150 millisecond fade-in.

## Consequences

- The interface must display remaining lives.
- Game state distinguishes a life loss from the end of a run.
- Collision handling must prevent repeated life loss from a single impact.
- Score belongs to the run, while snake length belongs to the current life.
- The ready state must maintain the invariant that food never overlaps the snake.
- Self-collision uses the occupancy that remains after accounting for whether the tail moves.
