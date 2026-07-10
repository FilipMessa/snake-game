# ADR 021: Fail-Fast Validation and Boundary Logging

## Status

Accepted

## Context

Invalid configuration should fail clearly, while reusable logging must not introduce side effects into pure domain functions.

## Decision

`createGameState` validates domain configuration before creating state and throws a descriptive `GameConfigurationError` for invalid values. `transitionGame` assumes validated configuration.

Domain services never log. React integration catches errors and logs each error exactly once through reusable functions in `src/shared/logger/LoggerService.ts`, with shared types in `Logger.types.ts`. Version one writes through `console.error`; callers do not use `console` directly.

The logger accepts a message, an optional unknown error, and optional structured context. It must not receive complete game state or sensitive browser data.

## Consequences

- Game service functions remain pure.
- Error logs are not duplicated across layers.
- A future logger implementation can replace console output without changing callers.
- Domain TDD tests assert error behavior, not logger calls.
