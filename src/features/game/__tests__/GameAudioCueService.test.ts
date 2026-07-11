import { describe, expect, it } from "vitest";

import { deriveAudioCues, type GameAudioCue } from "../GameAudioCueService";
import type { GameState } from "../Game.types";

const READY_STATE: GameState = {
  status: "ready",
  collisionLocked: false,
  snake: [{ x: 2, y: 2 }],
  food: { x: 1, y: 1 },
  direction: "right",
  bufferedTurn: null,
  foodsEaten: 0,
  score: 0,
  lives: 3,
  tickMs: 180,
  speedLevel: 1,
};

describe("GameAudioCueService", () => {
  describe("deriveAudioCues", () => {
    it("returns a start cue when a ready game becomes active", () => {
      const previous = READY_STATE;
      const next = { ...READY_STATE, status: "active" as const };

      const cues = deriveAudioCues(previous, next);

      expect(cues).toEqual<GameAudioCue[]>(["start"]);
    });

    it("returns food and level-up cues when both progress values increase", () => {
      const previous = { ...READY_STATE, status: "active" as const };
      const next = {
        ...previous,
        foodsEaten: 5,
        score: 50,
        speedLevel: 2,
      };

      const cues = deriveAudioCues(previous, next);

      expect(cues).toEqual<GameAudioCue[]>(["food-eaten", "level-up"]);
    });

    it("returns only a life-loss cue for a nonterminal collision", () => {
      const previous = { ...READY_STATE, status: "active" as const };
      const next = {
        ...previous,
        collisionLocked: true,
        lives: 2,
      };

      const cues = deriveAudioCues(previous, next);

      expect(cues).toEqual<GameAudioCue[]>(["life-lost"]);
    });

    it("returns terminal cues without layering food or life-loss cues", () => {
      const previous = { ...READY_STATE, status: "active" as const };
      const gameOver = {
        ...READY_STATE,
        status: "game-over" as const,
        lives: 0,
      };
      const completed = {
        ...READY_STATE,
        status: "completed" as const,
        foodsEaten: 1,
        score: 10,
      };

      const gameOverCues = deriveAudioCues(previous, gameOver);
      const completedCues = deriveAudioCues(previous, completed);

      expect(gameOverCues).toEqual<GameAudioCue[]>(["game-over"]);
      expect(completedCues).toEqual<GameAudioCue[]>(["victory"]);
    });

    it("returns no cues for normal movement or restart", () => {
      const active = { ...READY_STATE, status: "active" as const };
      const moved = { ...active, snake: [{ x: 3, y: 2 }] };
      const restarted = READY_STATE;

      const movementCues = deriveAudioCues(active, moved);
      const restartCues = deriveAudioCues(
        { ...READY_STATE, status: "game-over" as const },
        restarted,
      );

      expect(movementCues).toEqual<GameAudioCue[]>([]);
      expect(restartCues).toEqual<GameAudioCue[]>([]);
    });
  });
});
