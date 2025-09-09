/**
 * @file Utils.ts
 * Utility and helper functions for the Git Manager agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Translates a natural language action into a git command.
 * @param action The natural language action (e.g., "save my work").
 * @returns A corresponding git command string.
 */
export function translateToAction(action: string): string {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes('save') || lowerAction.includes('commit')) {
    return 'git commit -m "WIP"';
  }
  if (lowerAction.includes('push') || lowerAction.includes('upload')) {
    return 'git push';
  }
  if (lowerAction.includes('pull') || lowerAction.includes('update')) {
    return 'git pull';
  }
  return 'git status';
}
