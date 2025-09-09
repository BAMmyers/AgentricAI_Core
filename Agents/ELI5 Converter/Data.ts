/**
 * @file Data.ts
 * Data structures and state management for the ELI5 Converter agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a simplified explanation
export interface ELI5Explanation {
  topic: string;
  explanation: string;
}

// Example: The state for the converter
export interface ConverterState {
  lastExplanation: ELI5Explanation | null;
  status: 'idle' | 'simplifying' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): ConverterState {
  return {
    lastExplanation: null,
    status: 'idle',
  };
}
