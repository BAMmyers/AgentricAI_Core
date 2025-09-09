/**
 * @file Data.ts
 * Data structures and state management for the Agent Designer agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a new agent specification
export interface AgentSpec {
  name: string;
  role: string;
  suggestedPermissions: string[];
}

// Example: The state for the designer
export interface DesignerState {
  lastDesignedAgent: AgentSpec | null;
  status: 'idle' | 'designing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): DesignerState {
  return {
    lastDesignedAgent: null,
    status: 'idle',
  };
}
