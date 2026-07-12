# Architecture

The React application delegates business decisions to pure modules. `useGameController` is a thin composition facade over single-intent game-session, player-session, keyboard, timing, leaderboard, audio, and responsive-presentation hooks. `useLeaderboard` and `useGameAudio` are smaller facades over their own use-case hooks. Presentational components render view state and emit user intent; browser adapters own platform I/O.

## Architecture Plan

```mermaid
flowchart LR
  subgraph Browser[Browser and React integration]
    Keyboard[useKeyboardControls]
    Loop[useGameLoop]
    RAF[requestAnimationFrame]
    Hook[useGameController facade]
    GameSessionHook[useGameSession]
    PlayerSessionHook[usePlayerSession]
    AudioHook[useGameAudio facade]
    AudioPlaybackHook[useGameAudioPlayback]
    AudioPreferencesHook[useAudioPreferences]
    AudioPreferencesStorage[BrowserAudioPreferencesStorage]
    JsonStorage[JsonStorage]
    BrowserStorage[BrowserStorage]
    LeaderboardHook[useLeaderboard facade]
    LeaderboardEntriesHook[useLeaderboardEntries]
    LeaderboardScrollHook[useLeaderboardAutoScroll]
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
  Hook --> GameSessionHook
  Hook --> PlayerSessionHook
  RAF -->|frame timestamp| Loop
  Loop -->|tick event when elapsed| Hook
  GameSessionHook -->|state, event, dependencies| Service
  Service -->|new immutable state| GameSessionHook
  Service --- Create
  Service --- Transition
  Create --> Config
  Create --> Random
  Transition --> Config
  Transition --> Random
  NameForm -->|optional input| Hook
  PlayerSessionHook -->|input and random source| PlayerNameService
  PlayerNameService -->|resolved player name| PlayerSessionHook
  Hook --> LeaderboardHook
  Hook --> AudioHook
  AudioHook --> AudioPlaybackHook
  AudioHook --> AudioPreferencesHook
  AudioPreferencesHook --> AudioPreferencesStorage
  AudioPreferencesStorage --> JsonStorage
  AudioHook -->|audio state and actions| Hook
  LeaderboardHook --> LeaderboardEntriesHook
  LeaderboardHook --> LeaderboardScrollHook
  LeaderboardEntriesHook -->|record completed run| LeaderboardService
  LeaderboardEntriesHook --> Storage
  Storage --> JsonStorage
  JsonStorage --> BrowserStorage
  BrowserStorage --> LocalStorage

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
  LeaderboardHook -->|ranked entries and refs| Hook
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

  class useGameSession {
    <<hook>>
    +useGameSession(dependencies) UseGameSessionResult
  }

  class usePlayerSession {
    <<hook>>
    +usePlayerSession(maximumLength, random) UsePlayerSessionResult
  }

  class useKeyboardControls {
    <<hook>>
    +useKeyboardControls(options) void
  }

  class PlayerNameService {
    <<module>>
    +resolvePlayerName(input, maximumLength, random) string
  }

  class LeaderboardService {
    <<module>>
    +recordCompletedRun(entries, transition, maximumEntries) RecordCompletedRunResult
    +recordLeaderboardResult(entries, result, maximumEntries) LeaderboardEntry[]
    +restoreLeaderboard(value, maximumEntries) LeaderboardEntry[]
  }

  class BrowserLeaderboardStorage {
    <<adapter>>
    +load(maximumEntries) LeaderboardEntry[]
    +save(entries) void
  }

  class JsonStorage {
    <<module>>
    +load(...loadArguments) Value
    +save(value) void
  }

  class useLeaderboard {
    <<hook>>
    +useLeaderboard(state, playerName, maximumEntries) UseLeaderboardResult
  }

  class useLeaderboardEntries {
    <<hook>>
    +useLeaderboardEntries(state, playerName, maximumEntries) UseLeaderboardEntriesResult
  }

  class useLeaderboardAutoScroll {
    <<hook>>
    +useLeaderboardAutoScroll(currentEntry, playerName, status) UseLeaderboardAutoScrollResult
  }

  class useGameAudio {
    <<hook>>
    +useGameAudio(state) UseGameAudioResult
  }

  class useGameAudioPlayback {
    <<hook>>
    +useGameAudioPlayback(state, preferences) void
  }

  class useAudioPreferences {
    <<hook>>
    +useAudioPreferences() UseAudioPreferencesResult
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
  useGameController --> useGameSession
  useGameSession --> GameService
  useGameController --> GameBoardService
  Game --> useGameController
  useGameController --> usePlayerSession
  useGameController --> useKeyboardControls
  useGameController --> useLeaderboard
  useGameController --> useGameAudio
  useLeaderboard --> useLeaderboardEntries
  useLeaderboard --> useLeaderboardAutoScroll
  useLeaderboardEntries --> LeaderboardService
  useLeaderboardEntries --> BrowserLeaderboardStorage
  BrowserLeaderboardStorage --> JsonStorage
  useGameAudio --> useGameAudioPlayback
  useGameAudio --> useAudioPreferences
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
- `useGameController` is the thin feature composition seam. It exposes one view interface and coordinates `useGameSession`, `usePlayerSession`, `useKeyboardControls`, `useGameLoop`, `useLeaderboard`, `useGameAudio`, `useNarrowBoard`, and pure projection modules.
- `useGameSession` owns React game state and delegates every transition to `GameService`; `usePlayerSession` owns page-session player identity; `useKeyboardControls` owns only keyboard-to-game-event adaptation.
- `PlayerNameService.ts` owns player-name normalization, length validation, and random fallback generation; it imports neither React nor browser storage. `useGameController` derives whether player identity may change from the current game status as part of its view interface.
- `LeaderboardService.ts` owns terminal-transition eligibility, entry creation and validation, immutable ranking, tie-breaking, highlighting eligibility, and the configured entry limit.
- `LeaderboardStorage.ts` owns its versioned key and domain restoration. `AudioPreferencesStorage.ts` owns its key, defaults, and validation. Both compose the feature-local `JsonStorage.ts` mechanism for serialization, key-value I/O, and report-once failures; their browser adapters supply `window.localStorage` and the logger.
- `useLeaderboard` is a thin facade over `useLeaderboardEntries` and `useLeaderboardAutoScroll`. The entries hook reacts to game lifecycle and storage outcomes but delegates recording decisions to `LeaderboardService`; the auto-scroll hook owns only DOM refs and scrolling.
- `useGameAudio` is a thin facade over `useGameAudioPlayback` and `useAudioPreferences`. Audio preference rules live in `AudioPreferencesStorage.ts`; shared JSON persistence mechanics and browser composition stay behind their feature-local modules.
- `Game.tsx` is presentational and consumes only the view state and actions returned by hooks; leaderboard concerns do not enter `GameState` or `GameService`.
- `GameBoard.tsx` maps pre-projected cell intents to Tailwind classes and DOM elements; it does not call domain services, calculate cell positions, or inspect snake occupancy.
- A nonterminal collision preserves active state and all board entities. `collisionLocked` prevents repeated damage until a successful movement tick clears it.
- Tests exercise each approved public service seam; helper functions remain implementation details.
