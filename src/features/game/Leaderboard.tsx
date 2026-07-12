import type { FC } from "react";

import type { LeaderboardEntry } from "./LeaderboardService";
import { formatLeaderboardDate } from "./LeaderboardViewService";

interface LeaderboardProps {
  readonly entries: ReadonlyArray<LeaderboardEntry>;
}

export const Leaderboard: FC<LeaderboardProps> = ({ entries }) => (
  <section
    aria-labelledby="leaderboard-title"
    className="w-full max-w-[640px] rounded-2xl border border-neon-violet/40 bg-neon-panel/70 p-4"
  >
    <h2
      className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-neon-cyan"
      id="leaderboard-title"
    >
      Leaderboard
    </h2>
    {entries.length === 0 && (
      <p className="mt-3 font-mono text-xs text-neon-muted">No scores yet.</p>
    )}
    {entries.length > 0 && (
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs">
          <thead className="uppercase tracking-wider text-neon-muted">
            <tr>
              <th className="px-2 py-2 text-left" scope="col">
                #
              </th>
              <th className="px-2 py-2 text-left" scope="col">
                Player
              </th>
              <th className="px-2 py-2 text-right" scope="col">
                Score
              </th>
              <th className="px-2 py-2 text-right" scope="col">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr
                className="border-t border-neon-violet/20 text-white"
                key={`${entry.recordedAt}-${entry.playerName}-${entry.score}-${index}`}
              >
                <td className="px-2 py-2 text-neon-violet">{index + 1}</td>
                <td className="px-2 py-2">{entry.playerName}</td>
                <td className="px-2 py-2 text-right text-neon-lime">
                  {entry.score}
                </td>
                <td className="px-2 py-2 text-right text-neon-muted">
                  <time dateTime={entry.recordedAt}>
                    {formatLeaderboardDate(entry.recordedAt)}
                  </time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);
