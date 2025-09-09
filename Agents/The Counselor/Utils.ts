/**
 * @file Utils.ts
 * Utility and helper functions for the The Counselor agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Appends the mandatory disclaimer to a response.
 * @param responseText The agent's generated response.
 * @returns The response with the disclaimer added.
 */
export function addDisclaimer(responseText: string): string {
  const disclaimer = "\n\nDisclaimer: This is not professional advice.";
  return responseText + disclaimer;
}
