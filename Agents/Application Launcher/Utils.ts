
/**
 * @file Utils.ts
 * Utility and helper functions for the Application Launcher agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * A conceptual function to sanitize an application name to prevent command injection.
 * @param appName The raw application name from the task.
 * @returns A sanitized application name.
 */
export function sanitizeAppName(appName: string): string {
  // A real implementation would be much more robust.
  // This example removes common command injection characters.
  return appName.replace(/[;&|`$()<>]/g, '');
}
