/**
 * @file Data.ts
 * Data structures and state management for the Concept Explainer agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for an explanation
export interface Explanation {
  concept: string;
  explanation: string;
  analogy?: string;
  example?: string;
}

// Example: The state for the explainer
export interface ExplainerState {
  lastExplanation: Explanation | null;
  status: 'idle' | 'explaining' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): ExplainerState {
  return {
    lastExplanation: null,
    status: 'idle',
  };
}
