/**
 * @file Utils.ts
 * Utility and helper functions for the Recursive Web Crawler agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Validates if a string is a valid URL.
 * @param urlString The string to validate.
 * @returns True if it's a valid URL.
 */
export function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
}
