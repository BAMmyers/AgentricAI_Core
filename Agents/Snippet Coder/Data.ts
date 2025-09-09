/**
 * @file Data.ts
 * Data structures and state management for the Snippet Coder agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a code snippet
export interface CodeSnippet {
  language: string;
  code: string;
  description: string;
}

// Example: The state for the coder
export interface CoderState {
  lastSnippet: CodeSnippet | null;
  status: 'idle' | 'coding' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): CoderState {
  return {
    lastSnippet: null,
    status: 'idle',
  };
}
