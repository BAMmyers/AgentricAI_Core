/**
 * @file Utils.ts
 * Utility and helper functions for the The Apprentice agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Updates the agent's knowledge base with a new concept.
 * @param existingKnowledge The current list of learned concepts.
 * @param newConcept The new concept to add or update.
 * @returns The updated list of learned concepts.
 */
import { LearnedConcept } from './Data';

export function updateKnowledgeBase(existingKnowledge: LearnedConcept[], newConcept: LearnedConcept): LearnedConcept[] {
  const existingIndex = existingKnowledge.findIndex(c => c.topic === newConcept.topic);
  if (existingIndex > -1) {
    // Update existing concept
    existingKnowledge[existingIndex] = newConcept;
    return existingKnowledge;
  } else {
    // Add new concept
    return [...existingKnowledge, newConcept];
  }
}
