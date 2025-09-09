/**
 * @file Data.ts
 * Data structures and state management for the The Apprentice agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a learned concept
export interface LearnedConcept {
  topic: string;
  summary: string;
  confidence: number; // 0 to 1
}

// Example: The state for the apprentice
export interface ApprenticeState {
  knowledge: LearnedConcept[];
  currentTask: string | null;
  status: 'idle' | 'learning' | 'assisting' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): ApprenticeState {
  return {
    knowledge: [],
    currentTask: null,
    status: 'idle',
  };
}
