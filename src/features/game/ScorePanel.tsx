import type { FC } from "react";

interface ScorePanelProps {
  readonly score: number;
  readonly lives: number;
  readonly speedLevel: number;
}

export const ScorePanel: FC<ScorePanelProps> = ({
  score,
  lives,
  speedLevel,
}) => {
  return (
    <dl className="grid grid-cols-3 gap-2 font-mono text-xs uppercase tracking-[0.18em] sm:gap-4 sm:text-sm">
      <div className="rounded-xl border border-neon-cyan/30 bg-neon-panel/70 px-3 py-2 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
        <dt className="text-neon-muted">Score</dt>
        <dd
          aria-label={`Score ${score}`}
          className="mt-1 text-lg font-bold text-white sm:text-xl"
        >
          {score}
        </dd>
      </div>
      <div className="rounded-xl border border-neon-lime/30 bg-neon-panel/70 px-3 py-2 shadow-[0_0_20px_rgba(163,230,53,0.08)]">
        <dt className="text-neon-muted">Lives</dt>
        <dd
          aria-label={`Lives ${lives}`}
          className="mt-1 text-lg font-bold text-neon-lime sm:text-xl"
        >
          {lives}
        </dd>
      </div>
      <div className="rounded-xl border border-neon-violet/30 bg-neon-panel/70 px-3 py-2 shadow-[0_0_20px_rgba(167,139,250,0.08)]">
        <dt className="text-neon-muted">Level</dt>
        <dd
          aria-label={`Level ${speedLevel}`}
          className="mt-1 text-lg font-bold text-neon-violet sm:text-xl"
        >
          {speedLevel}
        </dd>
      </div>
    </dl>
  );
};
