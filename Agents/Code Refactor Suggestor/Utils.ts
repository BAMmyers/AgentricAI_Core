/**
 * @file Utils.ts
 * Utility and helper functions for the Code Refactor Suggestor agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * A conceptual check for "magic numbers" (unnamed numerical constants).
 * @param code The code to analyze.
 * @returns True if magic numbers are found.
 */
export function containsMagicNumbers(code: string): boolean {
  // This is a very simplistic check.
  const regex = /(?<!["'])\b\d+\b(?!["'])/g;
  return regex.test(code);
}
