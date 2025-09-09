/**
 * @file Utils.ts
 * Utility and helper functions for the Text Translator agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Checks if a language code is a valid ISO 639-1 code (conceptual).
 * @param langCode The language code (e.g., 'en', 'es').
 * @returns True if the code is valid.
 */
export function isValidLanguageCode(langCode: string): boolean {
  const validCodes = ['en', 'es', 'fr', 'de', 'ja', 'zh'];
  return validCodes.includes(langCode.toLowerCase());
}
