
/**
 * @file Data.ts
 * Data structures and state management for the Pros/Cons Lister agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a pros/cons list
export interface ProsConsList {
  topic: string;
  pros: string[];
  cons: string[];
}

// Example: The state for the lister
export interface ListerState {
  lastList: ProsConsList | null;
  status: 'idle' | 'listing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): ListerState {
  return {
    lastList: null,
    status: 'idle',
  };
}
