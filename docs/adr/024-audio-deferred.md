# ADR 024: Audio Deferred

## Status

Superseded by [ADR 028](./028-browser-audio-architecture.md)

## Context

Music and sound effects are desired, but browser audio activation, preferences, assets, and playback ownership would expand version-one scope.

## Decision

Version one is silent. Add music and sound effects in a later iteration after the visual game is complete.

Do not introduce an unused audio interface or adapter now. When audio is implemented, define its seam from concrete requirements such as food, collision, game-over, and completion cues, plus music lifecycle and volume controls.

## Consequences

- Version one has no audio assets, Web Audio code, or audio tests.
- Domain events and states remain expressive enough for future integration code to recognize audio-worthy transitions.
- The later audio design must respect browser user-activation rules.
