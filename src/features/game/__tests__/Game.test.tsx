import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_GAME_CONFIG } from "../Game.config";
import { Game } from "../Game";
import type { LeaderboardEntry } from "../LeaderboardService";
import { createLeaderboardStorage } from "../LeaderboardStorage";

describe("Game", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(
      () => undefined,
    );
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
      () => undefined,
    );
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("render", () => {
    it("generates a player name when the optional name is empty", () => {
      const dependencies = {
        config: DEFAULT_GAME_CONFIG,
        random: () => 0,
      };

      render(<Game dependencies={dependencies} />);

      expect(
        screen.getByRole("textbox", { name: "Player name" }),
      ).toBeVisible();

      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      expect(screen.getByText("Player: Player-0000")).toBeVisible();
      expect(screen.getByText("Ready?")).toBeVisible();
    });

    it("ignores game controls while the player form is open", () => {
      const dependencies = {
        config: DEFAULT_GAME_CONFIG,
        random: () => 0,
      };

      render(<Game dependencies={dependencies} />);
      const input = screen.getByRole("textbox", { name: "Player name" });

      fireEvent.keyDown(input, { key: "w" });
      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      expect(screen.getByText("Ready?")).toBeVisible();
    });

    it("changes the player outside active play", () => {
      const dependencies = {
        config: DEFAULT_GAME_CONFIG,
        random: () => 0,
      };

      render(<Game dependencies={dependencies} />);
      fireEvent.change(screen.getByRole("textbox", { name: "Player name" }), {
        target: { value: "Ada" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      fireEvent.click(screen.getByRole("button", { name: "Change player" }));
      fireEvent.change(screen.getByRole("textbox", { name: "Player name" }), {
        target: { value: "Grace" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      expect(screen.getByText("Player: Grace")).toBeVisible();
      expect(screen.getByText("Ready?")).toBeVisible();
    });

    it("renders the ready game status and keyboard instructions", () => {
      const dependencies = {
        config: DEFAULT_GAME_CONFIG,
        random: () => 0,
      };

      render(<Game dependencies={dependencies} />);
      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      expect(screen.getByLabelText("Score 0")).toBeInTheDocument();
      expect(screen.getByLabelText("Lives 3")).toBeInTheDocument();
      expect(screen.getByLabelText("Level 1")).toBeInTheDocument();
      expect(
        screen.getByRole("img", { name: /snake game board/i }),
      ).toBeVisible();
      expect(screen.getByText(/use arrow keys or wasd/i)).toBeVisible();

      fireEvent.click(screen.getByRole("button", { name: "Music on" }));

      expect(screen.getByRole("button", { name: "Music off" })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });

    it("reports unavailable audio preference storage once", () => {
      const dependencies = {
        config: DEFAULT_GAME_CONFIG,
        random: () => 0,
      };
      const storageError = new Error("Storage unavailable");
      const logError = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw storageError;
      });

      render(<Game dependencies={dependencies} />);
      fireEvent.click(screen.getByRole("button", { name: "Play" }));
      fireEvent.keyDown(window, { key: "ArrowRight" });

      expect(logError).toHaveBeenCalledOnce();
    });

    it("renders the leaderboard in the board overlay before play", () => {
      const dependencies = {
        config: DEFAULT_GAME_CONFIG,
        random: () => 0,
      };

      render(<Game dependencies={dependencies} />);
      const gameArea = screen.getByRole("region", { name: "Game area" });
      const leaderboardHeading = screen.getByRole("heading", {
        name: "Leaderboard",
      });

      expect(gameArea).toContainElement(leaderboardHeading);
      expect(screen.getByText("No scores yet.")).toBeVisible();

      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      expect(screen.getByText("Ready?")).toBeVisible();
      expect(gameArea).toContainElement(leaderboardHeading);

      fireEvent.keyDown(window, { key: "ArrowRight" });

      expect(leaderboardHeading).not.toBeInTheDocument();
    });

    it("renders persisted leaderboard entries with a display date", () => {
      const dependencies = {
        config: DEFAULT_GAME_CONFIG,
        random: () => 0,
      };
      const entries: ReadonlyArray<LeaderboardEntry> = [
        {
          playerName: "Ada",
          score: 40,
          recordedAt: "2026-07-11T12:00:00.000Z",
        },
      ];
      const storage = createLeaderboardStorage(window.localStorage, vi.fn());
      storage.save(entries);

      render(<Game dependencies={dependencies} />);

      expect(screen.getByRole("cell", { name: "Ada" })).toBeVisible();
      expect(screen.getByRole("cell", { name: "40" })).toBeVisible();
      expect(screen.getByRole("cell", { name: "11.07.2026" })).toBeVisible();
    });

    it("records a terminal result once for the current player", () => {
      const frames: FrameRequestCallback[] = [];
      let nextFrameId = 1;
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-07-11T12:00:00.000Z"));
      vi.spyOn(window, "requestAnimationFrame").mockImplementation(
        (callback) => {
          frames.push(callback);
          return nextFrameId++;
        },
      );
      vi.spyOn(window, "cancelAnimationFrame").mockImplementation(
        () => undefined,
      );
      const dependencies = {
        config: {
          ...DEFAULT_GAME_CONFIG,
          board: { width: 4, height: 4 },
          session: { initialLives: 1 },
        },
        random: () => 0,
      };
      const firstTimestamp = 0;
      const secondTimestamp = 180;
      const thirdTimestamp = 360;

      render(<Game dependencies={dependencies} />);
      fireEvent.change(screen.getByRole("textbox", { name: "Player name" }), {
        target: { value: "Ada" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Play" }));
      fireEvent.keyDown(window, { key: "ArrowRight" });

      act(() => frames.shift()?.(firstTimestamp));
      act(() => frames.shift()?.(secondTimestamp));
      act(() => frames.shift()?.(thirdTimestamp));
      fireEvent.click(screen.getByRole("button", { name: "Music on" }));

      expect(screen.getByText("Game Over")).toBeVisible();
      expect(
        screen.getByRole("heading", { name: "Leaderboard" }),
      ).toBeVisible();
      expect(screen.getAllByRole("cell", { name: "Ada" })).toHaveLength(1);
      expect(screen.getByRole("cell", { name: "0" })).toBeVisible();
      expect(screen.getByRole("cell", { name: "11.07.2026" })).toBeVisible();

      fireEvent.click(screen.getByRole("button", { name: "Change player" }));
      fireEvent.change(screen.getByRole("textbox", { name: "Player name" }), {
        target: { value: "Grace" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      expect(screen.getByText("Player: Grace")).toBeVisible();
      expect(screen.getByText("Ready?")).toBeVisible();
      expect(screen.getByLabelText("Score 0")).toBeVisible();
      expect(screen.getAllByRole("cell", { name: "Ada" })).toHaveLength(1);
    });

    it("marks only the newly retained tied result until the next run", () => {
      const frames: FrameRequestCallback[] = [];
      let nextFrameId = 1;
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-07-11T12:00:00.000Z"));
      vi.spyOn(window, "requestAnimationFrame").mockImplementation(
        (callback) => {
          frames.push(callback);
          return nextFrameId++;
        },
      );
      vi.spyOn(window, "cancelAnimationFrame").mockImplementation(
        () => undefined,
      );
      const dependencies = {
        config: {
          ...DEFAULT_GAME_CONFIG,
          board: { width: 4, height: 4 },
          session: { initialLives: 1 },
        },
        random: () => 0,
      };
      const entries: ReadonlyArray<LeaderboardEntry> = [
        {
          playerName: "Ada",
          score: 0,
          recordedAt: "2026-07-10T12:00:00.000Z",
        },
      ];
      const storage = createLeaderboardStorage(window.localStorage, vi.fn());
      storage.save(entries);
      const firstTimestamp = 0;
      const secondTimestamp = 180;
      const thirdTimestamp = 360;

      render(<Game dependencies={dependencies} />);
      fireEvent.change(screen.getByRole("textbox", { name: "Player name" }), {
        target: { value: "Ada" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Play" }));
      fireEvent.keyDown(window, { key: "ArrowRight" });
      act(() => frames.shift()?.(firstTimestamp));
      act(() => frames.shift()?.(secondTimestamp));
      act(() => frames.shift()?.(thirdTimestamp));

      const currentRows = screen
        .getAllByRole("row")
        .filter((row) => row.getAttribute("aria-current") === "true");

      expect(currentRows).toHaveLength(1);
      expect(within(currentRows[0]).getByText("11.07.2026")).toBeVisible();

      fireEvent.keyDown(window, { key: "Enter" });

      expect(screen.getByText("Ready?")).toBeVisible();
      expect(
        screen
          .getAllByRole("row")
          .filter((row) => row.hasAttribute("aria-current")),
      ).toHaveLength(0);
    });

    it("records a completed run in the leaderboard", () => {
      const frames: FrameRequestCallback[] = [];
      let nextFrameId = 1;
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-07-11T12:00:00.000Z"));
      vi.spyOn(window, "requestAnimationFrame").mockImplementation(
        (callback) => {
          frames.push(callback);
          return nextFrameId++;
        },
      );
      vi.spyOn(window, "cancelAnimationFrame").mockImplementation(
        () => undefined,
      );
      const dependencies = {
        config: {
          ...DEFAULT_GAME_CONFIG,
          board: { width: 4, height: 1 },
        },
        random: () => 0,
      };
      const firstTimestamp = 0;
      const secondTimestamp = 180;

      render(<Game dependencies={dependencies} />);
      fireEvent.change(screen.getByRole("textbox", { name: "Player name" }), {
        target: { value: "Ada" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Play" }));
      fireEvent.keyDown(window, { key: "ArrowRight" });

      act(() => frames.shift()?.(firstTimestamp));
      act(() => frames.shift()?.(secondTimestamp));

      expect(screen.getByText("You Win")).toBeVisible();
      expect(
        screen.getByRole("heading", { name: "Leaderboard" }),
      ).toBeVisible();
      expect(screen.getByRole("cell", { name: "Ada" })).toBeVisible();
      expect(screen.getByRole("cell", { name: "10" })).toBeVisible();
    });

    it("keeps playing and blinks the snake after a lost life", () => {
      const frames: FrameRequestCallback[] = [];
      let nextFrameId = 1;
      vi.spyOn(window, "requestAnimationFrame").mockImplementation(
        (callback) => {
          frames.push(callback);
          return nextFrameId++;
        },
      );
      vi.spyOn(window, "cancelAnimationFrame").mockImplementation(
        () => undefined,
      );
      const dependencies = {
        config: {
          ...DEFAULT_GAME_CONFIG,
          board: { width: 4, height: 4 },
        },
        random: () => 0,
      };
      const startKey = { key: "ArrowRight" };
      const firstTimestamp = 0;
      const secondTimestamp = 180;
      const thirdTimestamp = 360;

      render(<Game dependencies={dependencies} />);
      fireEvent.click(screen.getByRole("button", { name: "Play" }));

      fireEvent.keyDown(window, startKey);
      expect(screen.queryByText("Ready?")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "Leaderboard" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Change player" }),
      ).not.toBeInTheDocument();

      act(() => frames.shift()?.(firstTimestamp));
      act(() => frames.shift()?.(secondTimestamp));
      act(() => frames.shift()?.(thirdTimestamp));

      expect(
        screen.getByText("Life lost. 2 lives remaining."),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Lives 2")).toBeInTheDocument();
      expect(screen.queryByText("Ready?")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "Leaderboard" }),
      ).not.toBeInTheDocument();
      expect(
        screen
          .getByRole("img", { name: /snake game board/i })
          .querySelectorAll(".animate-snake-life-loss"),
      ).toHaveLength(3);
    });
  });
});
