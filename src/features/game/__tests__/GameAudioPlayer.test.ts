import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createGameAudioPlayer } from "../GameAudioPlayer";

describe("GameAudioPlayer", () => {
  let pause: ReturnType<typeof vi.spyOn<HTMLMediaElement, "pause">>;
  let play: ReturnType<typeof vi.spyOn<HTMLMediaElement, "play">>;

  beforeEach(() => {
    pause = vi
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => undefined);
    play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createGameAudioPlayer", () => {
    it("primes every media element from a user activation", () => {
      const player = createGameAudioPlayer();

      player.unlock();

      expect(play).toHaveBeenCalledTimes(7);
    });

    it("stops active effects when effects are disabled", () => {
      const player = createGameAudioPlayer();
      const cue = "life-lost" as const;
      const preferences = { musicEnabled: true, effectsEnabled: false };

      player.play([cue]);
      player.setPreferences(preferences);

      expect(pause).toHaveBeenCalled();
    });

    it("logs a rejected cue once per source", async () => {
      const playbackError = new Error("Playback blocked.");
      const cue = "life-lost" as const;
      const logError = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);
      play.mockRejectedValue(playbackError);
      const player = createGameAudioPlayer();

      player.play([cue]);
      await Promise.resolve();
      player.play([cue]);
      await Promise.resolve();

      expect(logError).toHaveBeenCalledOnce();
    });
  });
});
