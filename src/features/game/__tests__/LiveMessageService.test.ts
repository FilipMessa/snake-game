import { describe, expect, it } from "vitest";

import { deriveLiveMessage } from "../LiveMessageService";
import type { GameState } from "../Game.types";

describe("LiveMessageService", () => {
  describe("deriveLiveMessage", () => {
    it("returns the final score for a game over", () => {
      const state: GameState = {
        status: "game-over",
        collisionLocked: true,
        snake: [{ x: 1, y: 1 }],
        food: null,
        direction: "right",
        bufferedTurn: null,
        foodsEaten: 4,
        score: 40,
        lives: 0,
        tickMs: 180,
        speedLevel: 1,
      };

      const message = deriveLiveMessage(state);

      expect(message).toBe("Game over. Final score 40.");
    });
  });
});
