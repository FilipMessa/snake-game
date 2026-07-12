import { useCallback, useState } from "react";

import { createGameState, transitionGame } from "../GameService";
import type { GameDependencies, GameEvent, GameState } from "../Game.types";

export type UseGameSessionResult = Readonly<{
  dispatch(event: GameEvent): void;
  state: GameState;
}>;

export function useGameSession(
  dependencies: GameDependencies,
): UseGameSessionResult {
  const [state, setState] = useState(() => createGameState(dependencies));
  const dispatch = useCallback(
    (event: GameEvent): void => {
      setState((current) => transitionGame(current, event, dependencies));
    },
    [dependencies],
  );

  return { dispatch, state };
}
