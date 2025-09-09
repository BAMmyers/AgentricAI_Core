/**
 * @file Utils.ts
 * Utility and helper functions for the Visualizer agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Generates a basic textual description of a bar chart.
 * @param data An array of objects with 'label' and 'value' keys.
 * @returns A string describing the bar chart.
 */
export function describeBarChart(data: {label: string, value: number}[]): string {
  let description = 'A bar chart with the following data:\n';
  for (const item of data) {
    description += `- The bar for "${item.label}" has a value of ${item.value}.\n`;
  }
  return description;
}
