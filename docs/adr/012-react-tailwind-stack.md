# ADR 012: React and Tailwind Application Stack

## Status

Accepted

## Context

DOM rendering was selected over canvas, and the project is intended as an architecture-training exercise. The earlier vanilla TypeScript constraint was reconsidered.

## Decision

Use React, TypeScript, and Tailwind CSS for the browser application. Runtime dependencies are allowed again. React will render the board as DOM elements styled with Tailwind utilities.

React orchestration remains outside the pure TypeScript domain service. React components and hooks may import domain modules, but domain modules cannot import React.

## Consequences

- ADR 010's zero-runtime-dependency decision is superseded.
- UI state and rendering can use React while domain state remains independently testable if the proposed seam is retained.
- The architecture diagram must replace `DomRenderer` and imperative application wiring with React modules.
