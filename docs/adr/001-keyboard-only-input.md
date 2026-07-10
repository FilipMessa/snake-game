# ADR 001: Keyboard-Only Input

## Status

Accepted

## Context

The first release is a simple React and Tailwind Snake game. Supporting multiple input systems would expand the initial scope and require additional interaction design and testing.

## Decision

The initial game will support keyboard input only. Arrow keys and WASD map to the same four direction commands. A command directly opposite the snake's current direction is ignored, preventing an immediate reversal into its neck. Touch gestures and on-screen controls are out of scope.

The game buffers at most one legal direction change between movement ticks. After accepting a turn, it ignores further direction commands until the next tick advances the snake. This prevents rapid inputs from creating an indirect reversal.

## Consequences

- The first release targets desktop and laptop play.
- The layout may be responsive, but mobile devices are not required to be playable.
- A future touch adapter can translate gestures or buttons into the same direction commands.
- Browser scrolling must be prevented for handled direction keys while the game has focus.
- Operating-system key repeat cannot produce more than one accepted turn per tick.
