# ADR 013: Pure Services and React Hooks

## Status

Accepted

## Context

The project is an architecture and TDD exercise. Business rules should be independent of React while hooks should isolate React-specific state and effects.

## Proposed Decision

Place business logic in `${ComponentName}Service.ts` files as pure functions. Each function receives required dependencies as arguments and returns values instead of producing browser or React side effects. Develop these functions in vertical TDD slices: one failing behavioral test followed by the smallest passing implementation.

When a component needs React state, lifecycle, keyboard, or timing integration, create a dedicated hook that imports the relevant service functions. Components render hook output and do not implement domain rules.

Each feature hook owns one cohesive business or use-case intent. Technical steps such as loading, applying, and saving may remain together when they serve that one intent; independent capabilities and reasons to change require separate hooks. Hook length and effect count are not design criteria. A thin composition hook may coordinate these hooks behind one stable interface for the view, but it delegates business branching, validation, and transformation to pure modules.

Do not use a hook for pure derivation without React state or lifecycle. Components may retain simple render-only choices; complex view-model derivation and formatting belong in pure `*ViewService.ts` modules. Hooks remain feature-local until a second concrete consumer requires the same semantics.

Create a service file only when a component owns cohesive business behavior. The game domain is consolidated in `GameService.ts`; `GameBoard`, `ScorePanel`, and `GameOverlay` remain presentation-only unless independent rules emerge later.

## Consequences

- Business rules can be tested without rendering React.
- Hooks own React integration but delegate calculations and transitions.
- Single-intent hooks keep lifecycle and persistence changes local while composition hooks preserve small view interfaces.
- Shared hooks represent demonstrated reuse rather than speculative generality.
- Randomness and similar system-boundary dependencies are injected.
- Public test seams must be agreed before implementation begins.
