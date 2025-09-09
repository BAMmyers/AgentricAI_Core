/**
 * @file Utils.ts
 * Utility and helper functions for the Data Extractor agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * A simple regex-based email extractor.
 * @param text The text to search within.
 * @returns An array of found email addresses.
 */
export function extractEmails(text: string): string[] {
  const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
  return text.match(emailRegex) || [];
}
