# ADR 023: Discrete Movement

## Status

Accepted

## Context

Smooth interpolation between cells can make a grid-based collision state visually ambiguous.

## Decision

Render snake movement as discrete cell changes with no positional interpolation. Every visual position corresponds exactly to the latest `GameState` returned by `transitionGame`.

Animation is limited to non-positional feedback: food fade-in, restrained neon glow, life-loss feedback, and overlay transitions. Reduced-motion preferences disable or minimize those effects.

## Consequences

- Rendering never places a segment between logical cells.
- Collision timing remains visually predictable.
- `requestAnimationFrame` controls tick timing but does not interpolate snake coordinates.
