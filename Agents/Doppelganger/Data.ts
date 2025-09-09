/**
 * @file Data.ts
 * Data structures and state management for the Doppelganger agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a direct command
export interface Directive {
  source: string; // The governing agent
  command: string;
  params: any[];
}

// Example: The state for the doppelganger
export interface DoppelgangerState {
  lastDirective: Directive | null;
  status: 'idle' | 'executing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): DoppelgangerState {
  return {
    lastDirective: null,
    status: 'idle',
  };
}
