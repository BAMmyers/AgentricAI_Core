/**
 * @file Data.ts
 * Data structures and state management for the AgentricAI_001 agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a task to be dispatched
export interface DispatchedTask {
  targetAgent: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
}

// Example: The state for the coordinator
export interface CoordinatorState {
  activeTasks: DispatchedTask[];
  agentStatuses: Record<string, 'idle' | 'busy'>;
  status: 'idle' | 'processing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): CoordinatorState {
  return {
    activeTasks: [],
    agentStatuses: {},
    status: 'idle',
  };
}
