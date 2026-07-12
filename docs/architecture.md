# Architecture

The React application delegates every gameplay decision to pure functions in `GameService.ts`. The `useGameController` composition hook owns gameplay and player-session state, coordinates feature hooks, and owns browser input effects. Local leaderboard rules remain in pure player-name and leaderboard modules, while `useLeaderboard` composes those rules with the browser-storage adapter. Presentational components only render state and emit user intent.

## Architecture Plan

```mermaid
flowchart LR
  subgraph Browser[Browser and React integration]
    Keyboard[Keyboard events]
    Loop[useGameLoop]
    RAF[requestAnimationFrame]
    Hook[useGameController]
    AudioHook[useGameAudio]
    LeaderboardHook[useLeaderboard]
    Storage[BrowserLeaderboardStorage singleton]
    LocalStorage[localStorage]
  end

  subgraph Domain[Pure TypeScript domain]
    Service[GameService.ts]
    Create[createGameState]
    Transition[transitionGame]
    Config[GameConfig]
    Random[RandomSource function]
    PlayerNameService[PlayerNameService.ts]
    LeaderboardService[LeaderboardService.ts]
  end

  subgraph Presentation[React presentation]
    App[App]
    Game[Game]
    Board[GameBoard]
    BoardService[GameBoardService.ts]
    BoardViewService[GameBoardViewService.ts]
    Score[ScorePanel]
    Overlay[GameOverlay]
    NameForm[PlayerNameForm]
    PlayerPanel[PlayerPanel]
    Leaderboard[Leaderboard]
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
  NameForm -->|optional input| Hook
  Hook -->|input and random source| PlayerNameService
  PlayerNameService -->|resolved player name| Hook
  Hook --> LeaderboardHook
  Hook --> AudioHook
  AudioHook -->|audio state and actions| Hook
  LeaderboardHook -->|record and rank| LeaderboardService
  LeaderboardHook --> Storage
  Storage --> LocalStorage

  App --> Game
  Game --> Hook
  Game -->|board and projected cells| Board
  Hook -->|board and game state| BoardService
  BoardService -->|ordered cell intents| Hook
  Board -->|cell intents| BoardViewService
  BoardViewService -->|Tailwind class names| Board
  Game --> Score
  Game --> Overlay
  Game --> NameForm
  Game --> PlayerPanel
  Game --> Leaderboard
  LeaderboardHook -->|ranked entries| Hook
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
    +useGameController(dependencies) UseGameControllerResult
  }

  class PlayerNameService {
    <<module>>
    +resolvePlayerName(input, maximumLength, random) string
  }

  class LeaderboardService {
    <<module>>
    +recordLeaderboardResult(entries, result, maximumEntries) LeaderboardEntry[]
    +restoreLeaderboard(value, maximumEntries) LeaderboardEntry[]
  }

  class BrowserLeaderboardStorage {
    <<adapter>>
    +load(maximumEntries) LeaderboardEntry[]
    +save(entries) void
  }

  class useLeaderboard {
    <<hook>>
    +useLeaderboard(state, playerName, maximumEntries) LeaderboardEntry[]
  }

  class useGameAudio {
    <<hook>>
    +useGameAudio(state) UseGameAudioResult
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

  class GameBoardViewService {
    <<module>>
    +deriveGameBoardCellClassName(intent, animation) string
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

  class Leaderboard {
    <<React component>>
  }

  GameService --> GameDependencies
  GameService --> GameState
  GameService --> GameEvent
  useGameController --> GameService
  useGameController --> GameBoardService
  Game --> useGameController
  useGameController --> PlayerNameService
  useGameController --> useLeaderboard
  useGameController --> useGameAudio
  useLeaderboard --> LeaderboardService
  useLeaderboard --> BrowserLeaderboardStorage
  Game *-- GameBoard
  GameBoard --> GameBoardViewService
  GameBoardService --> GameState
  GameBoardService --> BoardCell
  Game *-- ScorePanel
  Game *-- GameOverlay
  Game *-- Leaderboard
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
- `GameBoardViewService.ts` maps a cell intent and animation state to its Tailwind classes.
- Dependencies such as configuration and randomness enter through function arguments.
- Randomness uses a function type, not a class hierarchy; production supplies `Math.random` and tests supply deterministic closures.
- `useGameController` is the feature composition seam. It owns gameplay and player-session state, exposes view state and user actions to `Game.tsx`, and coordinates `useGameLoop`, `useLeaderboard`, `useGameAudio`, `GameBoardService`, and pure services.
- `PlayerNameService.ts` owns player-name normalization, length validation, and random fallback generation; it imports neither React nor browser storage.
- `LeaderboardService.ts` owns persisted-entry validation, immutable ranking, tie-breaking, and the configured entry limit.
- `LeaderboardStorage.ts` owns the testable versioned JSON persistence implementation. `BrowserLeaderboardStorage.ts` composes it with `window.localStorage` and the logger as one production singleton that reports each load or save failure at most once.
- `useLeaderboard` records only transitions into a terminal state and keeps in-memory entries usable when persistence fails.
- `Game.tsx` is presentational and consumes only the view state and actions returned by hooks; leaderboard concerns do not enter `GameState` or `GameService`.
- `GameBoard.tsx` maps pre-projected cell intents to Tailwind classes and DOM elements; it does not call domain services, calculate cell positions, or inspect snake occupancy.
- A nonterminal collision preserves active state and all board entities. `collisionLocked` prevents repeated damage until a successful movement tick clears it.
- Tests exercise each approved public service seam; helper functions remain implementation details.
