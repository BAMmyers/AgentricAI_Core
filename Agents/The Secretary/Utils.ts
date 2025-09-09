/**
 * @file Utils.ts
 * Utility and helper functions for the The Secretary agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Creates a unique ID for new items.
 * @returns A unique identifier string.
 */
export function generateId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
