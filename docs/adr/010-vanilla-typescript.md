# ADR 010: Vanilla TypeScript

## Status

Superseded by ADR 012

## Context

The initial brief proposed React and Tailwind, but the design was simplified to TypeScript without external UI or styling libraries.

## Decision

Use vanilla TypeScript, native browser DOM APIs, HTML, and CSS. Do not use React, Tailwind, or other runtime libraries. Game rules must remain separate from DOM rendering and keyboard event adapters.

Development-only tooling is allowed for compilation, automated tests, linting, and formatting. The browser application must have zero runtime dependencies.

## Consequences

- The browser UI is rendered with native DOM elements.
- Styling uses repository-owned CSS.
- State transitions cannot depend on a framework lifecycle.
- The project has a smaller runtime dependency and bundle surface.
- Tooling choices should support architecture practice and verification without leaking into runtime design.

## Supersession

The project returned to React and Tailwind after choosing DOM-based rendering. The framework-free domain-module constraint remains valuable, but the zero-runtime-dependency constraint no longer applies.
