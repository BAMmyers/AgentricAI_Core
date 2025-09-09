/**
 * @file Data.ts
 * Data structures and state management for the Git Manager agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a conceptual repository state
export interface RepoState {
  currentBranch: string;
  uncommittedChanges: boolean;
  log: string[];
}

// Example: The state for the Git Manager
export interface GitManagerState {
  repo: RepoState;
  status: 'idle' | 'processing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): GitManagerState {
  return {
    repo: {
      currentBranch: 'main',
      uncommittedChanges: false,
      log: ['Initial commit'],
    },
    status: 'idle',
  };
}
