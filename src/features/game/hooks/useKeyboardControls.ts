import { useEffect, useEffectEvent } from "react";

import type { Direction, GameEvent } from "../Game.types";

type UseKeyboardControlsOptions = Readonly<{
  enabled: boolean;
  onEvent(event: GameEvent): void;
}>;

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

export function useKeyboardControls({
  enabled,
  onEvent,
}: UseKeyboardControlsOptions): void {
  const dispatchEvent = useEffectEvent(onEvent);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      const normalizedKey = event.key.toLowerCase();
      const direction = DIRECTION_BY_KEY[normalizedKey];

      if (direction !== undefined) {
        event.preventDefault();
        dispatchEvent({ type: "direction", direction });
        return;
      }

      if (normalizedKey === "enter") {
        event.preventDefault();
        dispatchEvent({ type: "restart" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}
