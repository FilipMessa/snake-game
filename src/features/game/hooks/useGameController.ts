import { useCallback, useEffect, useState } from "react";

import { createGameState, transitionGame } from "../GameService";
import type {
  Direction,
  GameDependencies,
  GameEvent,
  GameState,
} from "../Game.types";
import { useGameLoop } from "./useGameLoop";

const DIRECTION_BY_KEY: Readonly<Record<string, Direction>> = {
  arrowup: "up",
  w: "up",
  arrowdown: "down",
  s: "down",
  arrowleft: "left",
  a: "left",
  arrowright: "right",
  d: "right",
};

export function useGameController(dependencies: GameDependencies): GameState {
  const [state, setState] = useState(() => createGameState(dependencies));

  const dispatch = useCallback(
    (event: GameEvent): void => {
      setState((current) => transitionGame(current, event, dependencies));
    },
    [dependencies],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const normalizedKey = event.key.toLowerCase();
      const direction = DIRECTION_BY_KEY[normalizedKey];

      if (direction !== undefined) {
        event.preventDefault();
        dispatch({ type: "direction", direction });
        return;
      }

      if (normalizedKey === "enter") {
        event.preventDefault();
        dispatch({ type: "restart" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  useGameLoop({
    isRunning: state.status === "active",
    tickMs: state.tickMs,
    onTick: () => dispatch({ type: "tick" }),
  });

  return state;
}
