# ADR 025: Feature-First Source Layout

## Status

Accepted

## Context

Gameplay types, services, hooks, components, configuration, and tests change together and should remain easy to navigate as one cohesive feature.

## Decision

Use this source layout:

```text
src/
├── app/App.tsx
├── features/game/
│   ├── Game.tsx
│   ├── GameBoard.tsx
│   ├── GameBoardService.ts
│   ├── GameOverlay.tsx
│   ├── ScorePanel.tsx
│   ├── GameService.ts
│   ├── Game.config.ts
│   ├── Game.types.ts
│   ├── __tests__/
│   │   ├── Game.test.tsx
│   │   ├── GameBoardService.test.ts
│   │   └── GameService.test.ts
│   └── hooks/
│       ├── useGameController.ts
│       └── useGameLoop.ts
├── shared/logger/
│   ├── LoggerService.ts
│   └── Logger.types.ts
├── test/setup.ts
├── main.tsx
└── styles.css
```

Keep feature tests together in the adjacent `__tests__/` folder while naming each test after its public source seam. Add `${ComponentName}Service.ts` only when that component owns cohesive behavior; `GameBoardService.ts` owns board-cell projection while the other presentation components remain service-free.

## Consequences

- Game changes remain local to one feature folder.
- `shared/` cannot become a dumping ground for feature-specific helpers.
- New folders should represent ownership, not technical layers alone.
