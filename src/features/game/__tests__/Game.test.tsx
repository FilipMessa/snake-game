import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_GAME_CONFIG } from "../Game.config";
import { Game } from "../Game";

describe("Game", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the ready game status and keyboard instructions", () => {
    const dependencies = {
      config: DEFAULT_GAME_CONFIG,
      random: () => 0,
    };

    render(<Game dependencies={dependencies} />);

    expect(screen.getByLabelText("Score 0")).toBeInTheDocument();
    expect(screen.getByLabelText("Lives 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Level 1")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /snake game board/i }),
    ).toBeVisible();
    expect(screen.getByText(/use arrow keys or wasd/i)).toBeVisible();
  });

  it("uses animation frames to advance play and report a lost life", () => {
    const frames: FrameRequestCallback[] = [];
    let nextFrameId = 1;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.push(callback);
      return nextFrameId++;
    });
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

    fireEvent.keyDown(window, startKey);
    expect(screen.queryByText("Ready?")).not.toBeInTheDocument();

    act(() => frames.shift()?.(firstTimestamp));
    act(() => frames.shift()?.(secondTimestamp));
    act(() => frames.shift()?.(thirdTimestamp));

    expect(
      screen.getByText("Life lost. 2 lives remaining."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Lives 2")).toBeInTheDocument();
  });
});
