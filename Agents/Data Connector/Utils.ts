/**
 * @file Utils.ts
 * Utility and helper functions for the Data Connector agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * A simple merge strategy for multiple data objects.
 * @param inputs An array of objects to merge.
 * @returns A single merged object.
 */
export function simpleMerge(inputs: any[]): any {
  return inputs.reduce((acc, current) => ({ ...acc, ...current }), {});
}
