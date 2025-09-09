/**
 * @file Utils.ts
 * Utility and helper functions for the The Novelist agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Checks for common writing cliches in a piece of text.
 * @param text The text to analyze.
 * @returns An array of found cliches.
 */
export function findCliches(text: string): string[] {
  const cliches = ['at the end of the day', 'it was a dark and stormy night', 'in the nick of time'];
  const found = [];
  for (const cliche of cliches) {
    if (text.toLowerCase().includes(cliche)) {
      found.push(cliche);
    }
  }
  return found;
}
