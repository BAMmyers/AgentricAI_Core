/**
 * @file Utils.ts
 * Utility and helper functions for the Content Summarizer agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Calculates the word count of a given text.
 * @param text The text to analyze.
 * @returns The number of words.
 */
export function getWordCount(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}
