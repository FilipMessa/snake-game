import type { FC } from "react";

interface PlayerPanelProps {
  readonly canChange: boolean;
  readonly playerName: string;
  readonly onChange: () => void;
}

export const PlayerPanel: FC<PlayerPanelProps> = ({
  canChange,
  playerName,
  onChange,
}) => (
  <div className="mb-3 flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-wider text-neon-cyan">
    <p>Player: {playerName}</p>
    {canChange && (
      <button
        className="rounded border border-neon-violet px-2 py-1 text-neon-cyan"
        onClick={onChange}
        type="button"
      >
        Change player
      </button>
    )}
  </div>
);
