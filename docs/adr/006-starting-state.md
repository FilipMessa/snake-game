# ADR 006: Starting Snake State

## Status

Accepted

The life-loss reset decision is superseded by [ADR 029](./029-continuous-life-loss-recovery.md).

## Context

New runs need a deterministic, safe snake placement.

## Decision

The snake starts with three segments, centered horizontally on the board, with its head facing right. It remains in a ready state until any legal direction command is received. The left command is initially illegal because it directly reverses the snake.

Initial length belongs in the centralized game configuration; placement is calculated from board dimensions. Life loss does not recreate the starting state.

## Consequences

- Right, up, or down can begin play; left is ignored initially.
- Starting food cannot overlap the centered snake.
- Config validation must ensure the board can contain the configured starting length.
