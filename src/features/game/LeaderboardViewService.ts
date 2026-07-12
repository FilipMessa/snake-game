const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatLeaderboardDate(recordedAt: string): string {
  return DISPLAY_DATE_FORMATTER.format(new Date(recordedAt)).replaceAll(
    "/",
    ".",
  );
}
