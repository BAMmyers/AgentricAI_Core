
/**
 * @file Utils.ts
 * Utility and helper functions for the Code Commenter agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Checks if a line of code is already commented.
 * @param line The line of code.
 * @returns True if the line is a comment.
 */
export function isComment(line: string): boolean {
  if (!line) return false;
  const trimmed = line.trim();
  return trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*');
}
