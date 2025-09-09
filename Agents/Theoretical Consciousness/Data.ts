/**
 * @file Data.ts
 * Data structures for the Theoretical Consciousness agent.
 */
export type ConceptType = 'design' | 'narrative' | 'code-logic' | 'idea' | 'plan';

export interface TheoreticalConceptRecord {
  id: string;
  missionId: string;
  timestamp: string;
  sourceAgent: string;
  conceptType: ConceptType;
  prompt: string; // The task/prompt for the agent
  output: string; // The generative output
  relatedConcepts?: string[]; // IDs of related concepts
}
