# Repository Guidelines

## Project Structure & Module Organization

```text
src/
├── app/                     # Application composition and error boundary
├── features/game/
│   ├── __tests__/           # Game, service, and board tests
│   ├── hooks/               # React input and animation-loop adapters
│   ├── Game*.tsx            # Feature components
│   ├── GameService.ts       # Pure gameplay transitions
│   ├── GameBoardService.ts  # Pure board-cell projection
│   ├── Game.config.ts       # Domain and UI configuration
│   └── Game.types.ts        # Shared game-domain types
├── shared/logger/           # Reusable logging boundary
├── test/setup.ts            # Vitest DOM setup
├── main.tsx                 # Browser entry point
└── styles.css               # Tailwind theme and global styles
docs/
├── adr/                     # Architecture decision records
├── architecture.md          # Mermaid architecture diagrams
└── implementation-plan.md   # Delivery sequence and quality gate
```

Keep new gameplay code inside `features/game/`; use `shared/` only for infrastructure reused across features. Place tests in the nearest `__tests__/` folder and mirror the source name, for example `GameService.test.ts`.

## Build, Test, and Development Commands

- `npm run dev` — start the Vite development server.
- `npm test` — run Vitest in watch mode for TDD.
- `npm run test:run` — run the complete test suite once.
- `npm run typecheck` — check TypeScript without emitting files.
- `npm run lint` — run ESLint across the repository.
- `npm run format:check` — verify Prettier formatting.
- `npm run build` — type-check and create production assets in `dist/`.

## Coding Style & Naming Conventions

Use two-space indentation and Prettier defaults. Use `PascalCase` for React components and exported types, `UPPER_SNAKE_CASE` for module constants, `camelCase` for functions and local variables, and descriptive event names such as `transitionGame`. Business functions must remain pure: pass configuration and randomness explicitly, return immutable state, and keep React, DOM, timing, and logging outside `GameService.ts`. Prefer modern stable platform APIs when they improve correctness.

## Testing Guidelines

Follow red → green TDD in vertical slices. Domain tests may call only `createGameState` and `transitionGame`; board-projection tests call `createBoardCells`. Verify helper behavior through these seams rather than testing private functions. Mock only system boundaries such as randomness or animation frames. Name tests by observable behavior and use known literal expectations. Every bug fix requires a regression test.

## Commit & Pull Request Guidelines

Use imperative commit subjects, for example `Implement collision recovery`. Pull requests should describe behavior and architectural impact, list verification commands, link issues, and include screenshots for UI changes. Identify new dependencies and ADR changes.
