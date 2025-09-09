/**
 * @file Data.ts
 * Data structures and state management for the Code Refactor Suggestor agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a refactoring suggestion
export interface Suggestion {
  lineNumber: number;
  originalCode: string;
  suggestedCode: string;
  reason: string;
}

// Example: The state for the suggestor
export interface SuggestorState {
  suggestions: Suggestion[];
  status: 'idle' | 'analyzing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): SuggestorState {
  return {
    suggestions: [],
    status: 'idle',
  };
}
