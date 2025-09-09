/**
 * @file Utils.ts
 * Utility and helper functions for the The Mad Scientist agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Ranks ideas based on novelty and feasibility.
 * @param ideas An array of Idea objects.
 * @returns A sorted array of ideas, with the best ones first.
 */
import { Idea } from './Data';

export function rankIdeas(ideas: Idea[]): Idea[] {
  return [...ideas].sort((a, b) => {
    const scoreA = a.novelty * (a.feasibility === 'high' ? 3 : a.feasibility === 'medium' ? 2 : 1);
    const scoreB = b.novelty * (b.feasibility === 'high' ? 3 : b.feasibility === 'medium' ? 2 : 1);
    return scoreB - scoreA;
  });
}
