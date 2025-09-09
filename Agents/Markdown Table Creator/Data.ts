/**
 * @file Data.ts
 * Data structures and state management for the Markdown Table Creator agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for table data
export interface TableData {
  headers: string[];
  rows: string[][];
}

// Example: The state for the creator
export interface TableCreatorState {
  lastTable: string | null; // The generated markdown
  status: 'idle' | 'creating' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): TableCreatorState {
  return {
    lastTable: null,
    status: 'idle',
  };
}
