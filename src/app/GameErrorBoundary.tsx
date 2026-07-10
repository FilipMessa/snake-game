import { Component, type ErrorInfo, type ReactNode } from "react";

import { logError } from "../shared/logger/LoggerService";

type ErrorBoundaryState = Readonly<{ hasError: boolean }>;

interface GameErrorBoundaryProps {
  readonly children: ReactNode;
}

export class GameErrorBoundary extends Component<
  GameErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logError("The game encountered a fatal rendering error.", error, {
      componentStack: info.componentStack,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center px-6 text-center text-white">
          <div className="max-w-md rounded-2xl border border-neon-magenta/50 bg-neon-panel p-8 shadow-[0_0_30px_rgba(244,114,182,0.2)]">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-neon-magenta">
              Fatal signal error
            </p>
            <h1 className="mt-3 text-2xl font-black uppercase">
              Game unavailable
            </h1>
            <p className="mt-3 text-sm text-neon-muted">
              Reload the page to start a fresh session.
            </p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
