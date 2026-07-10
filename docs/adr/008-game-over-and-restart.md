# ADR 008: Game Over and Restart

## Status

Accepted

## Context

Exhausting all three lives ends a run and requires an unambiguous keyboard-only restart flow.

## Decision

When lives reach zero, movement stops and a game-over overlay shows the final score plus “Press Enter to restart.” Enter creates a new run with score zero, three lives, initial speed, the configured starting snake, and newly placed food.

Direction keys do not dismiss the game-over overlay.

## Consequences

- Run restart differs from life-loss recovery, which preserves score and speed.
- Restart must discard pending input and timers from the previous run.
- The overlay must remain readable without hiding the final score.
