
/**
 * @file Utils.ts
 * Utility and helper functions for the Anomaly Detection Engine agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Calculates the standard deviation for a set of numbers.
 * @param data An array of numbers.
 * @returns The standard deviation.
 */
export function calculateStandardDeviation(data: number[]): number {
  if (data.length === 0) return 0;
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((a, b) => a + (b - mean) ** 2, 0) / data.length;
  return Math.sqrt(variance);
}
