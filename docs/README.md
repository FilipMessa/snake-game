# Design Documentation

The design interview is complete, shared understanding is confirmed, and the approved implementation is present in the repository.

- [Architecture](architecture.md) — Mermaid module, dependency, and state diagrams.
- [Implementation plan](implementation-plan.md) — approved vertical TDD sequence and completion gate.
- [Domain glossary](glossary.md) — shared language for rules, state, modules, and seams.
- [`adr/`](adr/) — chronological decisions, including superseded alternatives for historical context.

The current direction is React, TypeScript, Tailwind, and Vite. Pure functions in `GameService.ts` own domain behavior through the approved `createGameState` and `transitionGame` test seam. React hooks own keyboard and animation-frame integration; components own presentation only.
