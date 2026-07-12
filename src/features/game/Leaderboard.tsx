import type { FC, RefObject } from "react";

import type { LeaderboardEntry } from "./LeaderboardService";
import { formatLeaderboardDate } from "./LeaderboardViewService";

interface LeaderboardProps {
  readonly currentEntry: LeaderboardEntry | null;
  readonly currentEntryRef: RefObject<HTMLTableRowElement | null>;
  readonly entries: ReadonlyArray<LeaderboardEntry>;
  readonly isCompact: boolean;
  readonly scrollContainerRef: RefObject<HTMLDivElement | null>;
  readonly showDate: boolean;
}

export const Leaderboard: FC<LeaderboardProps> = ({
  currentEntry,
  currentEntryRef,
  entries,
  isCompact,
  scrollContainerRef,
  showDate,
}) => (
  <section
    aria-labelledby="leaderboard-title"
    className={`flex min-h-0 w-full flex-1 flex-col rounded-2xl border border-neon-violet/40 bg-neon-panel/90 text-left ${isCompact ? "p-2" : "p-4"}`}
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
      <div
        className={`${isCompact ? "mt-1" : "mt-3"} min-h-0 overflow-auto`}
        ref={scrollContainerRef}
      >
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
              {showDate && (
                <th className="px-2 py-2 text-right" scope="col">
                  Date
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const isCurrent = entry === currentEntry;

              return (
                <tr
                  aria-current={isCurrent ? "true" : undefined}
                  className={`border-t border-neon-violet/20 text-white ${isCurrent ? "bg-neon-lime/15" : ""}`}
                  key={`${entry.recordedAt}-${entry.playerName}-${entry.score}-${index}`}
                  ref={isCurrent ? currentEntryRef : undefined}
                >
                  <td className="px-2 py-2 text-neon-violet">{index + 1}</td>
                  <td className="px-2 py-2">{entry.playerName}</td>
                  <td className="px-2 py-2 text-right text-neon-lime">
                    {entry.score}
                  </td>
                  {showDate && (
                    <td className="px-2 py-2 text-right text-neon-muted">
                      <time dateTime={entry.recordedAt}>
                        {formatLeaderboardDate(entry.recordedAt)}
                      </time>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </section>
);
