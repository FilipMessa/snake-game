# ADR 029: Continuous Life-Loss Recovery

## Status

Accepted

Supersedes the life-loss recovery portions of [ADR 002](./002-wall-collisions-and-lives.md), [ADR 003](./003-food-and-growth.md), [ADR 006](./006-starting-state.md), [ADR 007](./007-no-manual-pause.md), and [ADR 028](./028-browser-audio-architecture.md).

## Context

Resetting the snake to its initial position and length after every nonterminal collision discards spatial progress and interrupts play with a ready-state overlay. Continuous recovery should preserve the run's current challenge while ensuring that one blocked position cannot consume every remaining life.

## Decision

When an active snake attempts a wall or self-colliding move, the failed move is not applied. A nonterminal collision removes one life while preserving the snake's position and length, food, direction, score, food count, speed, and level. The game remains active and movement ticks continue without showing the ready-state overlay.

The collision locks after charging one life. Further blocked ticks preserve the remaining lives until the snake completes a legal move. That successful move clears the lock and makes a later collision eligible to remove another life. A direction buffered for a failed move is discarded so the player can choose another legal turn.

A nonterminal life loss blinks only the snake for the configured 260 milliseconds, updates the life counter, emits one polite accessibility announcement, and plays the life-loss effect once. Background music continues because the game remains active. Reduced-motion preferences suppress the blink.

When the final life is lost, the failed move is still not applied. The snake remains at its last valid position and length, the run enters game over immediately, and terminal visual and audio feedback replaces the nonterminal blink and sound.

## Consequences

- `GameState` records whether the current blocked contact has already charged a life.
- Snake length belongs to the run rather than to an individual life.
- Nonterminal collisions do not enter the ready state or invoke random food placement.
- The game loop may keep dispatching blocked ticks without repeatedly deducting lives.
- Life-loss presentation derives from an active collision-locked state.
- Only a successful movement tick re-enables collision damage.
