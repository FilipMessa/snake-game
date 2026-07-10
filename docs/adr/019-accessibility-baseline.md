# ADR 019: Visual-Game Accessibility Baseline

## Status

Accepted

## Context

Snake is inherently spatial and version one is not intended to provide a complete nonvisual gameplay mode. It should still avoid unnecessary barriers for sighted keyboard users and players sensitive to motion.

## Decision

Honor `prefers-reduced-motion` by removing the food fade and reducing animated glow. Maintain readable contrast, do not communicate status through color alone, preserve visible keyboard focus, and announce life loss, game over, and victory through a concise `aria-live` region.

Give the board one accessible label. Do not expose or narrate all grid cells individually, and do not claim full screen-reader playability.

## Consequences

- Visual effects must have reduced-motion variants.
- Status messages remain present as text, not only visual effects.
- Full nonvisual navigation and spatial narration remain out of scope.
