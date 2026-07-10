# ADR 018: Responsive Board Layout

## Status

Accepted

## Context

The fixed logical grid must remain readable across desktop window sizes without changing gameplay rules.

## Decision

Render the board as a square CSS Grid that grows to the largest size fitting the available viewport and is capped at approximately 640 pixels. Changing viewport size changes only cell pixels, never configured board dimensions or game state. Score, lives, and instructions remain outside the board.

Very narrow screens must remain viewable without horizontal overflow, but mobile play is not required because version one has keyboard-only input.

## Consequences

- Cells retain a square aspect ratio.
- Rendering derives grid columns and rows from configuration.
- Layout changes cannot restart or resize the logical game.
