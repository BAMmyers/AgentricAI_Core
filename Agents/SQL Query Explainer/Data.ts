/**
 * @file Data.ts
 * Data structures and state management for the SQL Query Explainer agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a query explanation
export interface QueryExplanation {
  query: string;
  explanation: string;
  tables: string[];
  joins: string[];
}

// Example: The state for the explainer
export interface ExplainerState {
  lastExplanation: QueryExplanation | null;
  status: 'idle' | 'explaining' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): ExplainerState {
  return {
    lastExplanation: null,
    status: 'idle',
  };
}
