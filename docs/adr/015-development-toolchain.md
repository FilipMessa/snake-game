# ADR 015: Development Toolchain

## Status

Accepted

## Context

The project needs fast feedback for TDD, React development, type safety, and consistent formatting.

## Decision

Use npm with the Vite React TypeScript template. Integrate Tailwind CSS through `@tailwindcss/vite`. Use Vitest for service tests and React Testing Library with jsdom for selected hook and UI integration tests. Run TypeScript checking separately with `tsc --noEmit`, because Vite transpilation does not perform type checking. Use ESLint and Prettier for static analysis and formatting.

Expected scripts are:

- `npm run dev` — start Vite development mode.
- `npm test` — run Vitest in watch mode.
- `npm run test:run` — run tests once.
- `npm run typecheck` — run TypeScript without emitting files.
- `npm run lint` — run ESLint.
- `npm run format` — apply Prettier.
- `npm run build` — type-check and build production assets.

## Consequences

- Domain TDD receives fast TypeScript-aware feedback.
- DOM integration tests are added selectively rather than duplicating service tests.
- Build success requires both type correctness and a successful Vite production build.
