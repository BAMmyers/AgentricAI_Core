/**
 * @file Data.ts
 * Data structures and state management for the PlantUML Diagram Generator agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a generated diagram
export interface Diagram {
  description: string;
  plantUMLCode: string;
}

// Example: The state for the generator
export interface GeneratorState {
  lastDiagram: Diagram | null;
  status: 'idle' | 'generating' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): GeneratorState {
  return {
    lastDiagram: null,
    status: 'idle',
  };
}
