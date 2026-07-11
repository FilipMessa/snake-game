# ADR 003: Food and Growth

## Status

Accepted

The life-loss food-placement decision is superseded by [ADR 029](./029-continuous-life-loss-recovery.md).

## Context

Food consumption defines the snake's growth and contributes to the run's progression.

## Decision

When the snake's head enters the food cell, the snake consumes the food and grows by exactly one segment.

Each consumed food item adds 10 points to the run's score. Immediately after consumption, the game randomly selects a new unoccupied cell for the replacement food. Exactly one food item exists at a time. The replacement is immediately active and edible while visually fading in over 150 milliseconds.

Food remains in its current cell after a nonterminal life loss because the snake is not reset.

## Consequences

- A normal movement tick removes the tail cell; a food-consumption tick retains it.
- Food must never occupy a cell occupied by the snake.
- Score increases only in increments of 10 and persists across life losses.
- Food selection must handle the case where no unoccupied cell remains.
- Animation state must not delay or otherwise affect food consumption.
