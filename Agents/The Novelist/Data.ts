/**
 * @file Data.ts
 * Data structures and state management for the The Novelist agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a story character
export interface Character {
  name: string;
  description: string;
  role: 'protagonist' | 'antagonist' | 'supporting';
}

// Example: The state for the novelist
export interface NovelistState {
  characters: Character[];
  plotOutline: string[];
  status: 'idle' | 'writing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): NovelistState {
  return {
    characters: [],
    plotOutline: [],
    status: 'idle',
  };
}
