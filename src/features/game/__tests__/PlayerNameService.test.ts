import { describe, expect, it } from "vitest";

import {
  PlayerNameValidationError,
  resolvePlayerName,
} from "../PlayerNameService";

describe("PlayerNameService", () => {
  describe("resolvePlayerName", () => {
    it("returns trimmed player input", () => {
      const input = "  Ada  ";
      const maximumLength = 20;
      const random = (): number => 0.5;

      const playerName = resolvePlayerName(input, maximumLength, random);

      expect(playerName).toBe("Ada");
    });

    it("returns a generated name for empty input", () => {
      const input = "   ";
      const maximumLength = 20;
      const random = (): number => 0.1234;

      const playerName = resolvePlayerName(input, maximumLength, random);

      expect(playerName).toBe("Player-1234");
    });

    it("throws a typed error when player input exceeds the limit", () => {
      const input = "123456789012345678901";
      const maximumLength = 20;
      const random = (): number => 0.5;

      const resolve = (): string =>
        resolvePlayerName(input, maximumLength, random);

      expect(resolve).toThrow(PlayerNameValidationError);
      expect(resolve).toThrow("Player name must not exceed 20 characters.");
    });
  });
});
