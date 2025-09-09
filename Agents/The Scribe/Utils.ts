/**
 * @file Utils.ts
 * Utility and helper functions for the The Scribe agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Increments a semantic version string.
 * @param version The current version (e.g., '1.0.0').
 * @param changeType The type of change ('major', 'minor', 'patch').
 * @returns The new version string.
 */
export function incrementVersion(version: string, changeType: 'major' | 'minor' | 'patch'): string {
  const parts = version.split('.').map(Number);
  if (changeType === 'major') {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
  } else if (changeType === 'minor') {
    parts[1]++;
    parts[2] = 0;
  } else {
    parts[2]++;
  }
  return parts.join('.');
}
