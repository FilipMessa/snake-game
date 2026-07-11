import type { FC } from "react";

interface AudioControlsProps {
  readonly effectsEnabled: boolean;
  readonly musicEnabled: boolean;
  readonly onToggleEffects: () => void;
  readonly onToggleMusic: () => void;
}

export const AudioControls: FC<AudioControlsProps> = ({
  effectsEnabled,
  musicEnabled,
  onToggleEffects,
  onToggleMusic,
}) => (
  <div className="flex gap-2 font-mono text-[10px] uppercase tracking-wider">
    <button
      aria-pressed={musicEnabled}
      className="rounded border border-neon-violet px-2 py-1 text-neon-cyan"
      onClick={onToggleMusic}
      type="button"
    >
      Music {musicEnabled ? "on" : "off"}
    </button>
    <button
      aria-pressed={effectsEnabled}
      className="rounded border border-neon-violet px-2 py-1 text-neon-cyan"
      onClick={onToggleEffects}
      type="button"
    >
      Effects {effectsEnabled ? "on" : "off"}
    </button>
  </div>
);
