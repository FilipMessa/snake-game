import { useCallback, useState } from "react";

import { resolvePlayerName } from "../PlayerNameService";

export type UsePlayerSessionResult = Readonly<{
  clearPlayer(): void;
  playerName: string | null;
  selectPlayer(input: string): void;
}>;

export function usePlayerSession(
  maximumPlayerNameLength: number,
  random: () => number,
): UsePlayerSessionResult {
  const [playerName, setPlayerName] = useState<string | null>(null);
  const selectPlayer = useCallback(
    (input: string): void => {
      setPlayerName(resolvePlayerName(input, maximumPlayerNameLength, random));
    },
    [maximumPlayerNameLength, random],
  );
  const clearPlayer = useCallback((): void => {
    setPlayerName(null);
  }, []);

  return { clearPlayer, playerName, selectPlayer };
}
