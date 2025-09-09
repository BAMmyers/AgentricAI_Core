/**
 * @file Utils.ts
 * Utility and helper functions for the Keyword Finder agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * A simple utility to check if a word is a "stop word" (a common word to be ignored).
 * @param word The word to check.
 * @returns True if it is a stop word, false otherwise.
 */
export function isStopWord(word: string): boolean {
  const stopWords = new Set(['a', 'an', 'the', 'is', 'in', 'it', 'of', 'for', 'on', 'with']);
  return stopWords.has(word.toLowerCase());
}
