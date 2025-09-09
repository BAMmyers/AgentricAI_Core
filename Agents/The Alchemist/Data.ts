/**
 * @file Data.ts
 * Data structures and state management for the The Alchemist agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a feature
export interface Feature {
  name: string;
  description: string;
  priority: 'must-have' | 'should-have' | 'nice-to-have';
}

// Example: Define a type for an application blueprint
export interface Blueprint {
  appName: string;
  architecture: string;
  features: Feature[];
}

// Example: The state for the alchemist
export interface AlchemistState {
  currentBlueprint: Blueprint | null;
  status: 'idle' | 'designing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): AlchemistState {
  return {
    currentBlueprint: null,
    status: 'idle',
  };
}
