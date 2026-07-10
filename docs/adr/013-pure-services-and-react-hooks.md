# ADR 013: Pure Services and React Hooks

## Status

Accepted

## Context

The project is an architecture and TDD exercise. Business rules should be independent of React while hooks should isolate React-specific state and effects.

## Proposed Decision

Place business logic in `${ComponentName}Service.ts` files as pure functions. Each function receives required dependencies as arguments and returns values instead of producing browser or React side effects. Develop these functions in vertical TDD slices: one failing behavioral test followed by the smallest passing implementation.

When a component needs React state, lifecycle, keyboard, or timing integration, create a dedicated hook that imports the relevant service functions. Components render hook output and do not implement domain rules.

Create a service file only when a component owns cohesive business behavior. The game domain is consolidated in `GameService.ts`; `GameBoard`, `ScorePanel`, and `GameOverlay` remain presentation-only unless independent rules emerge later.

## Consequences

- Business rules can be tested without rendering React.
- Hooks own React integration but delegate calculations and transitions.
- Randomness and similar system-boundary dependencies are injected.
- Public test seams must be agreed before implementation begins.
