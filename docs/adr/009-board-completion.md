# ADR 009: Board Completion

## Status

Accepted

## Context

Food placement has no valid result when the snake occupies every board cell.

## Decision

If consuming food fills the board, the run ends successfully. Movement stops and an overlay shows “You Win” with the final score. Pressing Enter starts a completely new run using the same reset behavior as game over.

## Consequences

- Food placement returns an explicit no-space result instead of looping indefinitely.
- Completion is a terminal state distinct from game over.
- Direction commands are ignored until Enter restarts the game.
