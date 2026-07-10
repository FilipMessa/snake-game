# ADR 005: Configurable Board Dimensions

## Status

Accepted

## Context

Board dimensions affect difficulty, layout, food placement, and starting positions. Future balancing should not require changes to game logic.

## Decision

Board width and height must be defined in the centralized game configuration, using values such as `boardWidth` and `boardHeight`. Game logic and rendering must derive dimensions from those values.

The default board is 20 cells wide by 20 cells high.

## Consequences

- Logic must not assume a square or hard-coded board.
- Starting positions must be calculated from configured dimensions.
- The UI must fit the configured grid within the available desktop viewport.
- Configuration validation must reject dimensions that cannot fit the starting snake.
