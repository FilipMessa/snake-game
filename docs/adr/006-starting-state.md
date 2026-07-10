# ADR 006: Starting Snake State

## Status

Accepted

## Context

New runs and life-loss recovery need a deterministic, safe snake placement.

## Decision

The snake starts with three segments, centered horizontally on the board, with its head facing right. It remains in a ready state until any legal direction command is received. The left command is initially illegal because it directly reverses the snake.

The same snake placement and ready state are restored after life loss. Initial length belongs in the centralized game configuration; placement is calculated from board dimensions.

## Consequences

- Right, up, or down can begin play; left is ignored initially.
- Starting food cannot overlap the centered snake.
- Config validation must ensure the board can contain the configured starting length.
