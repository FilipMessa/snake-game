import { useEffect, useRef, useState, type RefObject } from "react";

export type UseNarrowBoardResult = Readonly<{
  boardAreaRef: RefObject<HTMLElement | null>;
  isNarrowBoard: boolean;
}>;

export function useNarrowBoard(thresholdPx: number): UseNarrowBoardResult {
  const boardAreaRef = useRef<HTMLElement>(null);
  const [isNarrowBoard, setIsNarrowBoard] = useState(false);

  useEffect(() => {
    const boardArea = boardAreaRef.current;

    if (boardArea === null || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const updateWidth = (width: number): void => {
      setIsNarrowBoard(width < thresholdPx);
    };
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry !== undefined) {
        updateWidth(entry.contentRect.width);
      }
    });

    updateWidth(boardArea.getBoundingClientRect().width);
    observer.observe(boardArea);

    return () => observer.disconnect();
  }, [thresholdPx]);

  return { boardAreaRef, isNarrowBoard };
}
