/**
 * @file Data.ts
 * Data structures and state management for the Keyword Finder agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a keyword result
export interface KeywordResult {
  keyword: string;
  relevance: number; // A score from 0 to 1
}

// Example: The state for the finder
export interface FinderState {
  lastResult: KeywordResult[] | null;
  status: 'idle' | 'finding' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): FinderState {
  return {
    lastResult: null,
    status: 'idle',
  };
}
