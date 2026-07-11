import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createGameAudioPlayer } from "../GameAudioPlayer";

describe("GameAudioPlayer", () => {
  let pause: ReturnType<typeof vi.spyOn>;
  let play: ReturnType<typeof vi.spyOn>;

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

  it("primes every media element from a user activation", () => {
    const player = createGameAudioPlayer();

    player.unlock();

    expect(play).toHaveBeenCalledTimes(7);
  });

  it("stops active effects when effects are disabled", () => {
    const player = createGameAudioPlayer();

    player.play(["life-lost"]);
    player.setPreferences({ musicEnabled: true, effectsEnabled: false });

    expect(pause).toHaveBeenCalled();
  });
});
