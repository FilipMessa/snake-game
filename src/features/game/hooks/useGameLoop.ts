import { useEffect, useEffectEvent } from "react";

type UseGameLoopOptions = Readonly<{
  isRunning: boolean;
  tickMs: number;
  onTick: () => void;
}>;

export function useGameLoop({
  isRunning,
  tickMs,
  onTick,
}: UseGameLoopOptions): void {
  const handleTick = useEffectEvent(onTick);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    let animationFrameId: number | null = null;
    let previousTimestamp: number | null = null;
    let accumulatedMs = 0;

    const resetElapsedTime = (): void => {
      previousTimestamp = null;
      accumulatedMs = 0;
    };

    const runFrame = (timestamp: number): void => {
      if (previousTimestamp === null) {
        previousTimestamp = timestamp;
      } else {
        const elapsedMs = timestamp - previousTimestamp;
        previousTimestamp = timestamp;
        accumulatedMs += Math.min(elapsedMs, tickMs);

        if (accumulatedMs >= tickMs) {
          accumulatedMs = 0;
          handleTick();
        }
      }

      animationFrameId = window.requestAnimationFrame(runFrame);
    };

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === "visible") {
        resetElapsedTime();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    animationFrameId = window.requestAnimationFrame(runFrame);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning, tickMs]);
}
