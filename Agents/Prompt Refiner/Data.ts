/**
 * @file Data.ts
 * Data structures and state management for the Prompt Refiner agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a prompt analysis
export interface PromptAnalysis {
  originalPrompt: string;
  refinedPrompt: string;
  suggestions: string[];
}

// Example: The state for the refiner
export interface RefinerState {
  lastAnalysis: PromptAnalysis | null;
  status: 'idle' | 'refining' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): RefinerState {
  return {
    lastAnalysis: null,
    status: 'idle',
  };
}
