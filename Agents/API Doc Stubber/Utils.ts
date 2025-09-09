
/**
 * @file Utils.ts
 * Utility and helper functions for the API Doc Stubber agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Creates a URL-friendly slug from a string.
 * @param text The input text.
 * @returns A slugified string.
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}
