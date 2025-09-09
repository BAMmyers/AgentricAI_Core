/**
 * @file Utils.ts
 * Utility and helper functions for the The Alchemist agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Sorts features by priority.
 * @param features An array of Feature objects.
 * @returns A sorted array of Feature objects.
 */
import { Feature } from './Data';

export function sortFeaturesByPriority(features: Feature[]): Feature[] {
  const priorityOrder = { 'must-have': 0, 'should-have': 1, 'nice-to-have': 2 };
  return [...features].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
