
/**
 * @file Utils.ts
 * Utility and helper functions for the Pros/Cons Lister agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */
import { ProsConsList } from './Data';

/**
 * Formats a pros/cons list into a markdown string.
 * @param list The list object.
 * @returns A formatted markdown string.
 */
export function formatAsMarkdown(list: ProsConsList): string {
  let output = `## Pros and Cons for: ${list.topic}\n\n`;
  output += '### Pros\n';
  output += list.pros.map(p => `- ${p}`).join('\n');
  output += '\n\n### Cons\n';
  output += list.cons.map(c => `- ${c}`).join('\n');
  return output;
}
