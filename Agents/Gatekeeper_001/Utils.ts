/**
 * @file Utils.ts
 * Utility and helper functions for the Gatekeeper_001 agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Checks if a user has the required access level.
 * @param userLevel The user's current access level.
 * @param requiredLevel The required access level for the resource.
 * @returns True if access is permitted, false otherwise.
 */
export function hasSufficientPermissions(userLevel: 'guest' | 'developer' | 'admin', requiredLevel: 'guest' | 'developer' | 'admin'): boolean {
  const levels = { guest: 0, developer: 1, admin: 2 };
  return levels[userLevel] >= levels[requiredLevel];
}
