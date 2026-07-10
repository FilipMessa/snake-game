import { describe, expect, it } from "vitest";

import { DEFAULT_GAME_CONFIG } from "../Game.config";
import { createBoardCells } from "../GameBoardService";
import { createGameState } from "../GameService";

describe("GameBoardService", () => {
  describe("createBoardCells", () => {
    it("projects every configured board position into an ordered cell intent", () => {
      const board = { width: 3, height: 2 };
      const dependencies = {
        config: {
          ...DEFAULT_GAME_CONFIG,
          board,
        },
        random: () => 0,
      };
      const state = createGameState(dependencies);

      const cells = createBoardCells(board, state);

      expect(cells).toEqual([
        { key: "0-0", position: { x: 0, y: 0 }, intent: "food" },
        { key: "1-0", position: { x: 1, y: 0 }, intent: "empty" },
        { key: "2-0", position: { x: 2, y: 0 }, intent: "empty" },
        { key: "0-1", position: { x: 0, y: 1 }, intent: "snake-body" },
        { key: "1-1", position: { x: 1, y: 1 }, intent: "snake-body" },
        { key: "2-1", position: { x: 2, y: 1 }, intent: "snake-head" },
      ]);
    });
  });
});
