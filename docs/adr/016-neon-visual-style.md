# ADR 016: Neon Visual Style

## Status

Accepted

## Context

The game needs a distinct visual identity while keeping presentation independent from gameplay architecture.

## Decision

Use a neon arcade style implemented through React markup and Tailwind utilities. Use a dark background, luminous game elements, a subtle grid, restrained glow, compact status information, and translucent terminal-state overlays that leave the board visible.

Colors and effects are presentation concerns. Domain state exposes semantic concepts such as snake head, snake body, food, and status; it does not expose CSS classes or color names.

The palette uses a deep navy-black background, electric lime snake body, cyan snake head, hot magenta food, violet borders and overlays, white primary text, and muted cyan secondary labels.

## Consequences

- Presentation must maintain readable contrast despite glow effects.
- Glow must not obscure cell boundaries or collision positions.
- Repeated visual values should be expressed as Tailwind theme tokens rather than scattered arbitrary classes.
