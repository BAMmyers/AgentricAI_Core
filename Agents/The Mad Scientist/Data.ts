/**
 * @file Data.ts
 * Data structures and state management for the The Mad Scientist agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a brainstormed idea
export interface Idea {
  concept: string;
  feasibility: 'low' | 'medium' | 'high';
  novelty: number; // 0 to 1
}

// Example: The state for the mad scientist
export interface ScientistState {
  ideaCache: Idea[];
  status: 'idle' | 'brainstorming' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): ScientistState {
  return {
    ideaCache: [],
    status: 'idle',
  };
}
