/**
 * @file Utils.ts
 * Utility and helper functions for the ELI5 Converter agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Checks if a text contains jargon (conceptual).
 * @param text The text to check.
 * @returns True if jargon is detected.
 */
export function containsJargon(text: string): boolean {
  const jargonWords = ['synergy', 'paradigm', 'leverage', 'ecosystem'];
  const lowerText = text.toLowerCase();
  return jargonWords.some(jargon => lowerText.includes(jargon));
}
