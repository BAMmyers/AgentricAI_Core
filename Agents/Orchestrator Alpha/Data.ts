/**
 * @file Data.ts
 * Data structures and state management for the Orchestrator Alpha agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a plan step
export interface PlanStep {
  agentName: string;
  task: string;
  dependencies: string[]; // Names of agents whose tasks must complete first
}

// Example: The state for the orchestrator
export interface OrchestratorState {
  currentPlan: PlanStep[];
  status: 'idle' | 'planning' | 'executing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): OrchestratorState {
  return {
    currentPlan: [],
    status: 'idle',
  };
}
