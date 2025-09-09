/**
 * @file Utils.ts
 * Utility and helper functions for the Format As Code agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * A simple conceptual language detector.
 * @param text The text to analyze.
 * @returns The detected language name (e.g., 'json', 'javascript').
 */
export function detectLanguage(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
  if (trimmed.includes('function') || trimmed.includes('const') || trimmed.includes('let')) return 'javascript';
  if (trimmed.includes('def') || trimmed.includes('import')) return 'python';
  return 'plaintext';
}
