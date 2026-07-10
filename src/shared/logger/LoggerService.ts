import type { LogContext } from "./Logger.types";

export function logError(
  message: string,
  error?: unknown,
  context?: LogContext,
): void {
  console.error(message, { error, context });
}
