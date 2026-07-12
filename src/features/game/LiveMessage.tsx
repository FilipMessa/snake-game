import type { FC } from "react";

import type { GameState } from "./Game.types";
import { deriveLiveMessage } from "./LiveMessageService";

interface LiveMessageProps {
  readonly state: GameState;
}

export const LiveMessage: FC<LiveMessageProps> = ({ state }) => {
  const message = deriveLiveMessage(state);

  return (
    <p aria-live="polite" className="sr-only">
      {message}
    </p>
  );
};
