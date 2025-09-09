/**
 * @file Utils.ts
 * Utility and helper functions for the Snippet Coder agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Wraps a code string in markdown code fences.
 * @param code The code snippet.
 * @param language The language for syntax highlighting.
 * @returns A markdown-formatted string.
 */
export function formatAsMarkdown(code: string, language: string): string {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}
