/**
 * @file Utils.ts
 * Utility and helper functions for the Concept Explainer agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Checks the complexity of a word (conceptual).
 * @param word The word to check.
 * @returns True if the word is considered complex.
 */
export function isComplexWord(word: string): boolean {
  // A simple check based on length and syllables (conceptual)
  return word.length > 10;
}
