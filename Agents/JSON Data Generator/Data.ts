/**
 * @file Data.ts
 * Data structures and state management for the JSON Data Generator agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a JSON generation result
export interface JsonResult {
  description: string;
  jsonData: string;
}

// Example: The state for the generator
export interface GeneratorState {
  lastResult: JsonResult | null;
  status: 'idle' | 'generating' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): GeneratorState {
  return {
    lastResult: null,
    status: 'idle',
  };
}
