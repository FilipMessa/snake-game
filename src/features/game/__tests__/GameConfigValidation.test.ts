import { describe, expect, it } from "vitest";

import { DEFAULT_GAME_CONFIG } from "../Game.config";
import { validateGameConfig } from "../GameConfigValidation";

describe("validateGameConfig", () => {
  it("rejects non-integer board dimensions", () => {
    expect(() =>
      validateGameConfig({
        ...DEFAULT_GAME_CONFIG,
        board: { width: 20.5, height: 20 },
      }),
    ).toThrowError("Board dimensions must be positive integers.");
  });
});
