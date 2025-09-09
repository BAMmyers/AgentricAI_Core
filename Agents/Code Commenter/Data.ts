
/**
 * @file Data.ts
 * Data structures and state management for the Code Commenter agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for commented code
export interface CommentedCode {
  originalCode: string;
  commentedCode: string;
}

// Example: The state for the commenter
export interface CommenterState {
  lastResult: CommentedCode | null;
  status: 'idle' | 'commenting' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): CommenterState {
  return {
    lastResult: null,
    status: 'idle',
  };
}
