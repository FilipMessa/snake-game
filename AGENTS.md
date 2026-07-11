# Repository Guidelines

## Project Structure & Module Organization

```text
assets/                      # Versioned README and documentation images
src/
├── app/                     # Composition and error boundary
├── features/game/
│   ├── __tests__/           # Feature tests
│   ├── hooks/               # Input and animation adapters
│   ├── Game*.tsx            # Feature components
│   ├── GameService.ts       # Pure gameplay transitions
│   ├── GameBoardService.ts  # Pure board-cell projection
│   ├── Game.config.ts       # Domain and UI configuration
│   └── Game.types.ts        # Shared game-domain types
├── shared/logger/           # Logging boundary
├── test/setup.ts            # Vitest setup
├── main.tsx                 # Browser entry
└── styles.css               # Tailwind and global styles
docs/
├── adr/                     # Decision records
├── architecture.md          # Mermaid diagrams
└── implementation-plan.md   # Delivery and quality gate
```

Keep new gameplay code inside `features/game/`; use `shared/` only for infrastructure reused across features. Place tests in the nearest `__tests__/` folder and mirror the source name.

## Build, Test, and Development Commands

- `npm run dev` — start Vite.
- `npm test` — run Vitest watch mode.
- `npm run test:run` — run tests once.
- `npm run typecheck` — check TypeScript.
- `npm run lint` — run ESLint.
- `npm run format:check` — verify Prettier.
- `npm run build` — type-check and build `dist/`.

## Coding Style & Naming Conventions

Use two-space indentation and Prettier defaults. Use `PascalCase` for React components/types, `UPPER_SNAKE_CASE` for module constants, and `camelCase` for functions/locals. Business functions must remain pure: pass configuration and randomness explicitly, return immutable state, and keep React, DOM, timing, and logging outside `GameService.ts`. Prefer stable platform APIs.

## Runtime Boundaries & Configuration

- Put every tunable gameplay or render/UI value in `Game.config.ts`; keep feature-local browser, media, and persistence constants within their owning feature module.
- Use `requestAnimationFrame` for the game loop with cleanup and background-tab elapsed-time reset; do not introduce `setInterval` or `setTimeout` for movement.
- Pure domain services throw typed errors and never log. React boundaries and browser adapters log non-fatal platform failures once through `LoggerService`; direct `console.*` calls are not allowed elsewhere.

## Testing Guidelines

Use red → green TDD. Test domain behavior through public seams (`createGameState`, `transitionGame`, `createBoardCells`); mock only system boundaries and add regression tests for fixes.

## Commit & Pull Request Guidelines

Use imperative commit subjects. Pull requests should describe behavior, checks, screenshots, dependencies, and ADR changes.

## Assets & Git Workflow

Version README/documentation images in `assets/` and browser-served game audio in `public/audio/`. Ignore editor, Playwright, dependency, build, and coverage artifacts. Direct pushes to `main` require an explicit request.
