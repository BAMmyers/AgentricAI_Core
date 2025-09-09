/**
 * @file Utils.ts
 * Utility and helper functions for the Collector Alpha agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Combines multiple text inputs into a single string for summarization.
 * @param data An array of CollectedData objects.
 * @returns A single combined string.
 */
import { CollectedData } from './Data';

export function combineTexts(data: CollectedData[]): string {
  return data.map(d => `--- From ${d.sourceAgent} ---\n${d.content}`).join('\n\n');
}
