/**
 * @file Utils.ts
 * Utility and helper functions for the JSON Data Generator agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Validates if a string is valid JSON.
 * @param jsonString The string to check.
 * @returns True if the string is valid JSON.
 */
export function isValidJson(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
}
