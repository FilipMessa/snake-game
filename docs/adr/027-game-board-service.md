# ADR 027: Separate GameBoard Projection Service

## Status

Accepted

## Context

`GameBoard.tsx` needs an ordered cell view model derived from board dimensions, snake occupancy, and food position. Keeping that projection in `GameService.ts` expands the domain seam with rendering-oriented behavior, while computing it directly in the component mixes projection and DOM rendering.

## Decision

Create `GameBoardService.ts` with one pure public function:

```ts
createBoardCells(board, state): ReadonlyArray<BoardCell>
```

The service generates row-major positions and assigns semantic intents: `snake-head`, `snake-body`, `food`, or `empty`. `GameBoard.tsx` maps those intents to Tailwind classes and DOM cells. `GameService.ts` returns to its approved two-function domain seam.

## Consequences

- Board projection is testable without React or CSS assertions.
- Game rules remain isolated from rendering concerns.
- The component owns markup and styling only.
- `__tests__/GameBoardService.test.ts` sits beside the feature modules and exercises the new public seam.
