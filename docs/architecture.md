# Architecture

The React application delegates every gameplay decision to pure functions in `GameService.ts`. The `useGameController` hook owns React state and browser effects, while presentational components only render the returned state.

## Architecture Plan

```mermaid
flowchart LR
  subgraph Browser[Browser and React integration]
    Keyboard[Keyboard events]
    Loop[useGameLoop]
    RAF[requestAnimationFrame]
    Hook[useGameController]
  end

  subgraph Domain[Pure TypeScript domain]
    Service[GameService.ts]
    Create[createGameState]
    Transition[transitionGame]
    Config[GameConfig]
    Random[RandomSource function]
  end

  subgraph Presentation[React presentation]
    App[App]
    Game[Game]
    Board[GameBoard]
    BoardService[GameBoardService.ts]
    Score[ScorePanel]
    Overlay[GameOverlay]
    Tailwind[Tailwind CSS]
  end

  Keyboard -->|direction or restart event| Hook
  RAF -->|frame timestamp| Loop
  Loop -->|tick event when elapsed| Hook
  Hook -->|state, event, dependencies| Service
  Service -->|new immutable state| Hook
  Service --- Create
  Service --- Transition
  Create --> Config
  Create --> Random
  Transition --> Config
  Transition --> Random

  App --> Game
  Game --> Hook
  Game --> Board
  Board -->|board and game state| BoardService
  BoardService -->|ordered cell intents| Board
  Game --> Score
  Game --> Overlay
  Hook -->|view state| Game
  Tailwind -. styles .-> Game
  Tailwind -. styles .-> Board
  Tailwind -. styles .-> Score
  Tailwind -. styles .-> Overlay

  Tests[GameService tests] -->|same public functions| Service
  BoardTests[GameBoardService tests] -->|createBoardCells| BoardService
  Deterministic[Deterministic test closure] -. supplies .-> Random
  BrowserRandom[Math.random] -. supplies .-> Random
```

## Module Diagram

```mermaid
classDiagram
  direction LR

  class GameService {
    <<module>>
    +createGameState(dependencies) GameState
    +transitionGame(state, event, dependencies) GameState
  }

  class GameDependencies {
    +config: GameConfig
    +random: RandomSource
  }

  class GameState {
    +status: GameStatus
    +collisionLocked: boolean
    +snake: ReadonlyArray~Position~
    +food: Position?
    +direction: Direction
    +bufferedTurn: Direction?
    +foodsEaten: number
    +score: number
    +lives: number
    +tickMs: number
    +speedLevel: number
  }

  class GameEvent {
    <<union>>
    direction
    tick
    restart
  }

  class useGameController {
    <<hook>>
    +useGameController(dependencies) GameViewModel
  }

  class Game {
    <<React component>>
  }

  class GameBoard {
    <<React component>>
  }

  class GameBoardService {
    <<module>>
    +createBoardCells(board, state) ReadonlyArray~BoardCell~
  }

  class BoardCell {
    +key: string
    +position: Position
    +intent: BoardCellIntent
  }

  class ScorePanel {
    <<React component>>
  }

  class GameOverlay {
    <<React component>>
  }

  GameService --> GameDependencies
  GameService --> GameState
  GameService --> GameEvent
  useGameController --> GameService
  Game --> useGameController
  Game *-- GameBoard
  GameBoard --> GameBoardService
  GameBoardService --> GameState
  GameBoardService --> BoardCell
  Game *-- ScorePanel
  Game *-- GameOverlay
```

## Game State Diagram

```mermaid
stateDiagram-v2
  [*] --> Ready: createGameState
  Ready --> Active: legal direction
  Active --> Active: direction or safe tick
  Active --> Active: collision / lives remain / lock damage
  Active --> Active: safe tick / clear collision lock
  Active --> GameOver: collision / zero lives
  Active --> Completed: snake fills board
  GameOver --> Ready: restart event
  Completed --> Ready: restart event
```

## Dependency Rules

- `GameService.ts` imports no React or browser modules and performs no side effects.
- `GameService.ts` exposes only `createGameState` and `transitionGame`; it contains gameplay rules, not board rendering projection.
- `GameBoardService.ts` converts configured positions and immutable game state into ordered semantic cell intents through `createBoardCells`.
- Dependencies such as configuration and randomness enter through function arguments.
- Randomness uses a function type, not a class hierarchy; production supplies `Math.random` and tests supply deterministic closures.
- `useGameController` owns keyboard listeners and React state updates; `useGameLoop` owns animation-frame timing.
- `GameBoard.tsx` maps cell intents to Tailwind classes and DOM elements; it does not calculate cell positions or inspect snake occupancy.
- A nonterminal collision preserves active state and all board entities. `collisionLocked` prevents repeated damage until a successful movement tick clears it.
- Tests exercise each approved public service seam; helper functions remain implementation details.
