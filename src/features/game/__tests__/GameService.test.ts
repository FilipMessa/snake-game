import { describe, expect, it } from "vitest";

import { DEFAULT_GAME_CONFIG } from "../Game.config";
import type { GameDependencies, GameEvent } from "../Game.types";
import { createGameState, transitionGame } from "../GameService";

const TEST_DEPENDENCIES = {
  config: DEFAULT_GAME_CONFIG,
  random: () => 0,
} satisfies GameDependencies;

const START_UP_EVENT = {
  type: "direction",
  direction: "up",
} satisfies GameEvent;

const START_LEFT_EVENT = {
  type: "direction",
  direction: "left",
} satisfies GameEvent;

const TURN_LEFT_EVENT = START_LEFT_EVENT;

const TURN_DOWN_EVENT = {
  type: "direction",
  direction: "down",
} satisfies GameEvent;

const TICK_EVENT = { type: "tick" } satisfies GameEvent;

const RESTART_EVENT = { type: "restart" } satisfies GameEvent;

const INVALID_GAME_CASES: ReadonlyArray<{
  readonly name: string;
  readonly dependencies: GameDependencies;
  readonly expectedError: string;
}> = [
  {
    name: "rejects a starting snake that cannot fit on the board",
    dependencies: {
      config: {
        ...DEFAULT_GAME_CONFIG,
        board: { width: 2, height: 20 },
      },
      random: () => 0,
    },
    expectedError: "Snake initial length must fit within the board width.",
  },
  {
    name: "rejects nonpositive board dimensions",
    dependencies: {
      config: {
        ...DEFAULT_GAME_CONFIG,
        board: { width: 0, height: 20 },
      },
      random: () => 0,
    },
    expectedError: "Board dimensions must be positive integers.",
  },
  {
    name: "rejects a session without lives",
    dependencies: {
      config: {
        ...DEFAULT_GAME_CONFIG,
        session: { initialLives: 0 },
      },
      random: () => 0,
    },
    expectedError: "Initial lives must be a positive integer.",
  },
  {
    name: "rejects a nonpositive initial snake length",
    dependencies: {
      config: {
        ...DEFAULT_GAME_CONFIG,
        snake: { initialLength: 0 },
      },
      random: () => 0,
    },
    expectedError: "Snake initial length must be a positive integer.",
  },
  {
    name: "rejects nonpositive food scoring",
    dependencies: {
      config: {
        ...DEFAULT_GAME_CONFIG,
        scoring: { pointsPerFood: 0 },
      },
      random: () => 0,
    },
    expectedError: "Points per food must be a positive integer.",
  },
  {
    name: "rejects a minimum tick duration above the initial duration",
    dependencies: {
      config: {
        ...DEFAULT_GAME_CONFIG,
        speed: {
          ...DEFAULT_GAME_CONFIG.speed,
          minimumTickMs: 200,
        },
      },
      random: () => 0,
    },
    expectedError:
      "Minimum tick duration cannot exceed the initial tick duration.",
  },
  {
    name: "rejects nonpositive speed progression values",
    dependencies: {
      config: {
        ...DEFAULT_GAME_CONFIG,
        speed: {
          ...DEFAULT_GAME_CONFIG.speed,
          progression: {
            ...DEFAULT_GAME_CONFIG.speed.progression,
            tickReductionMs: 0,
          },
        },
      },
      random: () => 0,
    },
    expectedError: "Speed values must be positive integers.",
  },
  {
    name: "rejects random values outside the unit interval",
    dependencies: {
      config: DEFAULT_GAME_CONFIG,
      random: () => 1,
    },
    expectedError:
      "Random source must return a value from 0 up to, but not including, 1.",
  },
];

describe("GameService", () => {
  describe("createGameState", () => {
    it("creates a centered ready game with deterministic food", () => {
      const dependencies = TEST_DEPENDENCIES;

      const state = createGameState(dependencies);

      expect(state).toEqual({
        status: "ready",
        collisionLocked: false,
        snake: [
          { x: 10, y: 10 },
          { x: 9, y: 10 },
          { x: 8, y: 10 },
        ],
        food: { x: 0, y: 0 },
        direction: "right",
        bufferedTurn: null,
        foodsEaten: 0,
        score: 0,
        lives: 3,
        tickMs: 180,
        speedLevel: 1,
      });
    });

    it.each(INVALID_GAME_CASES)("$name", ({ dependencies, expectedError }) => {
      let thrownError: unknown;

      try {
        createGameState(dependencies);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).toMatchObject({ message: expectedError });
    });
  });

  describe("transitionGame", () => {
    it("starts a ready game when a legal direction is requested", () => {
      const ready = createGameState(TEST_DEPENDENCIES);

      const active = transitionGame(ready, START_UP_EVENT, TEST_DEPENDENCIES);

      expect(active).toMatchObject({
        status: "active",
        direction: "right",
        bufferedTurn: "up",
      });
    });

    it("moves the snake one cell on an active tick", () => {
      const ready = createGameState(TEST_DEPENDENCIES);
      const active = transitionGame(ready, START_UP_EVENT, TEST_DEPENDENCIES);

      const moved = transitionGame(active, TICK_EVENT, TEST_DEPENDENCIES);

      expect(moved.snake).toEqual([
        { x: 10, y: 9 },
        { x: 10, y: 10 },
        { x: 9, y: 10 },
      ]);
    });

    it("applies at most one buffered turn per tick", () => {
      const ready = createGameState(TEST_DEPENDENCIES);
      const active = transitionGame(ready, START_UP_EVENT, TEST_DEPENDENCIES);
      const movedUp = transitionGame(active, TICK_EVENT, TEST_DEPENDENCIES);
      const withLeftBuffered = transitionGame(
        movedUp,
        TURN_LEFT_EVENT,
        TEST_DEPENDENCIES,
      );
      const ignoredSecondTurn = transitionGame(
        withLeftBuffered,
        TURN_DOWN_EVENT,
        TEST_DEPENDENCIES,
      );

      const moved = transitionGame(
        ignoredSecondTurn,
        TICK_EVENT,
        TEST_DEPENDENCIES,
      );

      expect(moved).toMatchObject({
        direction: "left",
        bufferedTurn: null,
        snake: [
          { x: 9, y: 9 },
          { x: 10, y: 9 },
          { x: 10, y: 10 },
        ],
      });
    });

    it("ignores a direct reversal request", () => {
      const ready = createGameState(TEST_DEPENDENCIES);

      const unchanged = transitionGame(
        ready,
        START_LEFT_EVENT,
        TEST_DEPENDENCIES,
      );

      expect(unchanged).toBe(ready);
    });

    it("grows by one segment and scores when food is eaten", () => {
      const ready = createGameState(TEST_DEPENDENCIES);
      const active = {
        ...ready,
        status: "active" as const,
        food: { x: 11, y: 10 },
      };

      const fed = transitionGame(active, TICK_EVENT, TEST_DEPENDENCIES);

      expect(fed).toMatchObject({
        snake: [
          { x: 11, y: 10 },
          { x: 10, y: 10 },
          { x: 9, y: 10 },
          { x: 8, y: 10 },
        ],
        food: { x: 0, y: 0 },
        foodsEaten: 1,
        score: 10,
      });
    });

    it("increases the configured speed level after five foods", () => {
      const ready = createGameState(TEST_DEPENDENCIES);
      const beforeLevelUp = {
        ...ready,
        status: "active" as const,
        food: { x: 11, y: 10 },
        foodsEaten: 4,
        score: 40,
      };

      const leveledUp = transitionGame(
        beforeLevelUp,
        TICK_EVENT,
        TEST_DEPENDENCIES,
      );

      expect(leveledUp).toMatchObject({
        foodsEaten: 5,
        score: 50,
        tickMs: 170,
        speedLevel: 2,
      });
    });

    it("caps speed progression at the configured minimum tick duration", () => {
      const ready = createGameState(TEST_DEPENDENCIES);
      const atMaximumSpeed = {
        ...ready,
        status: "active" as const,
        food: { x: 11, y: 10 },
        foodsEaten: 54,
        score: 540,
        tickMs: 80,
        speedLevel: 11,
      };

      const stillCapped = transitionGame(
        atMaximumSpeed,
        TICK_EVENT,
        TEST_DEPENDENCIES,
      );

      expect(stillCapped).toMatchObject({
        foodsEaten: 55,
        tickMs: 80,
        speedLevel: 11,
      });
    });

    it("loses one life and preserves active play after hitting a wall", () => {
      const ready = createGameState(TEST_DEPENDENCIES);
      const nearWall = {
        ...ready,
        status: "active" as const,
        snake: [
          { x: 0, y: 10 },
          { x: 1, y: 10 },
          { x: 2, y: 10 },
        ],
        food: { x: 5, y: 5 },
        direction: "left" as const,
        score: 40,
        foodsEaten: 4,
        tickMs: 170,
        speedLevel: 2,
      };

      const recovered = transitionGame(nearWall, TICK_EVENT, TEST_DEPENDENCIES);

      expect(recovered).toMatchObject({
        status: "active",
        snake: [
          { x: 0, y: 10 },
          { x: 1, y: 10 },
          { x: 2, y: 10 },
        ],
        food: { x: 5, y: 5 },
        direction: "left",
        bufferedTurn: null,
        lives: 2,
        score: 40,
        foodsEaten: 4,
        tickMs: 170,
        speedLevel: 2,
      });
    });

    it("loses one life and preserves the snake after hitting its body", () => {
      const ready = createGameState(TEST_DEPENDENCIES);
      const curlingIntoItself = {
        ...ready,
        status: "active" as const,
        snake: [
          { x: 2, y: 2 },
          { x: 2, y: 3 },
          { x: 1, y: 3 },
          { x: 1, y: 2 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
        ],
        direction: "left" as const,
        food: { x: 5, y: 5 },
      };

      const recovered = transitionGame(
        curlingIntoItself,
        TICK_EVENT,
        TEST_DEPENDENCIES,
      );

      expect(recovered).toMatchObject({
        status: "active",
        lives: 2,
        snake: [
          { x: 2, y: 2 },
          { x: 2, y: 3 },
          { x: 1, y: 3 },
          { x: 1, y: 2 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
        ],
      });
    });

    it("allows the head to enter a tail cell that vacates on the same tick", () => {
      const ready = createGameState(TEST_DEPENDENCIES);
      const followingItsTail = {
        ...ready,
        status: "active" as const,
        snake: [
          { x: 2, y: 2 },
          { x: 2, y: 3 },
          { x: 1, y: 3 },
          { x: 1, y: 2 },
        ],
        direction: "left" as const,
        food: { x: 5, y: 5 },
      };

      const moved = transitionGame(
        followingItsTail,
        TICK_EVENT,
        TEST_DEPENDENCIES,
      );

      expect(moved).toMatchObject({
        status: "active",
        lives: 3,
        snake: [
          { x: 1, y: 2 },
          { x: 2, y: 2 },
          { x: 2, y: 3 },
          { x: 1, y: 3 },
        ],
      });
    });

    it("ends the run when the final life is lost", () => {
      const ready = createGameState(TEST_DEPENDENCIES);
      const finalLife = {
        ...ready,
        status: "active" as const,
        snake: [
          { x: 0, y: 10 },
          { x: 1, y: 10 },
          { x: 2, y: 10 },
        ],
        direction: "left" as const,
        lives: 1,
      };

      const gameOver = transitionGame(finalLife, TICK_EVENT, TEST_DEPENDENCIES);

      expect(gameOver).toMatchObject({
        status: "game-over",
        collisionLocked: true,
        lives: 0,
        snake: finalLife.snake,
      });
    });

    it("preserves food after a nonterminal collision", () => {
      const ready = createGameState(TEST_DEPENDENCIES);
      const nearWall = {
        ...ready,
        status: "active" as const,
        snake: [
          { x: 0, y: 10 },
          { x: 1, y: 10 },
          { x: 2, y: 10 },
        ],
        direction: "left" as const,
        food: { x: 10, y: 10 },
      };

      const recovered = transitionGame(nearWall, TICK_EVENT, TEST_DEPENDENCIES);

      expect(recovered.food).toEqual({ x: 10, y: 10 });
    });

    it("deducts only one life while the snake remains blocked", () => {
      const ready = createGameState(TEST_DEPENDENCIES);
      const nearWall = {
        ...ready,
        status: "active" as const,
        snake: [
          { x: 0, y: 10 },
          { x: 1, y: 10 },
          { x: 2, y: 10 },
        ],
        direction: "left" as const,
      };
      const firstBlockedTick = transitionGame(
        nearWall,
        TICK_EVENT,
        TEST_DEPENDENCIES,
      );

      const secondBlockedTick = transitionGame(
        firstBlockedTick,
        TICK_EVENT,
        TEST_DEPENDENCIES,
      );

      expect(secondBlockedTick).toMatchObject({
        status: "active",
        lives: 2,
        snake: nearWall.snake,
      });
    });

    it("re-enables collision damage after a successful move", () => {
      const ready = createGameState(TEST_DEPENDENCIES);
      const nearWall = {
        ...ready,
        status: "active" as const,
        snake: [
          { x: 0, y: 10 },
          { x: 1, y: 10 },
          { x: 2, y: 10 },
        ],
        direction: "left" as const,
      };
      const blocked = transitionGame(nearWall, TICK_EVENT, TEST_DEPENDENCIES);
      const turningDown = transitionGame(
        blocked,
        TURN_DOWN_EVENT,
        TEST_DEPENDENCIES,
      );
      const moved = transitionGame(turningDown, TICK_EVENT, TEST_DEPENDENCIES);
      const turningLeft = transitionGame(
        moved,
        TURN_LEFT_EVENT,
        TEST_DEPENDENCIES,
      );

      const blockedAgain = transitionGame(
        turningLeft,
        TICK_EVENT,
        TEST_DEPENDENCIES,
      );

      expect(moved).toMatchObject({
        collisionLocked: false,
        lives: 2,
        snake: [
          { x: 0, y: 11 },
          { x: 0, y: 10 },
          { x: 1, y: 10 },
        ],
      });
      expect(blockedAgain).toMatchObject({
        collisionLocked: true,
        lives: 1,
      });
    });

    it("starts a completely new run when a terminal game restarts", () => {
      const initialDependencies = {
        config: DEFAULT_GAME_CONFIG,
        random: () => 0.5,
      };
      const ready = createGameState(initialDependencies);
      const gameOver = {
        ...ready,
        status: "game-over" as const,
        score: 150,
        foodsEaten: 15,
        lives: 0,
        tickMs: 150,
        speedLevel: 4,
      };

      const restarted = transitionGame(
        gameOver,
        RESTART_EVENT,
        TEST_DEPENDENCIES,
      );

      expect(restarted).toEqual({
        status: "ready",
        collisionLocked: false,
        snake: [
          { x: 10, y: 10 },
          { x: 9, y: 10 },
          { x: 8, y: 10 },
        ],
        food: { x: 0, y: 0 },
        direction: "right",
        bufferedTurn: null,
        foodsEaten: 0,
        score: 0,
        lives: 3,
        tickMs: 180,
        speedLevel: 1,
      });
    });

    it("completes the run when eating fills every board cell", () => {
      const compactConfig = {
        ...DEFAULT_GAME_CONFIG,
        board: { width: 2, height: 2 },
      };
      const almostComplete = {
        status: "active" as const,
        collisionLocked: false,
        snake: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
        ],
        food: { x: 1, y: 0 },
        direction: "right" as const,
        bufferedTurn: null,
        foodsEaten: 0,
        score: 0,
        lives: 3,
        tickMs: 180,
        speedLevel: 1,
      };
      const dependencies = { config: compactConfig, random: () => 0 };

      const completed = transitionGame(
        almostComplete,
        TICK_EVENT,
        dependencies,
      );

      expect(completed).toMatchObject({
        status: "completed",
        food: null,
        snake: [
          { x: 1, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
        ],
        score: 10,
      });
    });
  });
});
