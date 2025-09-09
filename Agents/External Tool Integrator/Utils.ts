/**
 * @file Utils.ts
 * Utility and helper functions for the External Tool Integrator agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Serializes command arguments for a conceptual API call.
 * @param args The arguments object.
 * @returns A serialized string.
 */
export function serializeArgs(args: Record<string, any>): string {
  return Object.entries(args).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
}
