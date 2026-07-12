import { describe, expect, it } from "vitest";

import { DEFAULT_GAME_CONFIG } from "../Game.config";
import { validateGameConfig } from "../GameConfigValidation";

describe("GameConfigValidation", () => {
  describe("validateGameConfig", () => {
    it("throws for non-integer board dimensions", () => {
      const config = {
        ...DEFAULT_GAME_CONFIG,
        board: { width: 20.5, height: 20 },
      };

      expect(() => validateGameConfig(config)).toThrowError(
        "Board dimensions must be positive integers.",
      );
    });

    it("throws when snake initial length does not fit board width", () => {
      const config = {
        ...DEFAULT_GAME_CONFIG,
        board: { width: 4, height: 20 },
        snake: {
          ...DEFAULT_GAME_CONFIG.snake,
          initialLength: 5,
        },
      };

      expect(() => validateGameConfig(config)).toThrowError(
        "Snake initial length must fit within the board width.",
      );
    });

    it("throws for non-positive initial lives", () => {
      const config = {
        ...DEFAULT_GAME_CONFIG,
        session: {
          ...DEFAULT_GAME_CONFIG.session,
          initialLives: 0,
        },
      };

      expect(() => validateGameConfig(config)).toThrowError(
        "Initial lives must be a positive integer.",
      );
    });

    it("throws for non-integer speed progression values", () => {
      const config = {
        ...DEFAULT_GAME_CONFIG,
        speed: {
          ...DEFAULT_GAME_CONFIG.speed,
          progression: {
            ...DEFAULT_GAME_CONFIG.speed.progression,
            tickReductionMs: 2.5,
          },
        },
      };

      expect(() => validateGameConfig(config)).toThrowError(
        "Speed values must be positive integers.",
      );
    });

    it("throws when minimum tick duration is greater than initial tick duration", () => {
      const config = {
        ...DEFAULT_GAME_CONFIG,
        speed: {
          ...DEFAULT_GAME_CONFIG.speed,
          initialTickMs: 100,
          minimumTickMs: 110,
        },
      };

      expect(() => validateGameConfig(config)).toThrowError(
        "Minimum tick duration cannot exceed the initial tick duration.",
      );
    });

    it("returns without throwing for a valid game configuration", () => {
      const config = DEFAULT_GAME_CONFIG;

      expect(() => validateGameConfig(config)).not.toThrow();
    });
  });
});
