
/**
 * @file Data.ts
 * Data structures and state management for the Bug agent.
 * This file defines the shape of data this agent works with and manages.
 */

export type BugStatus = 'detected' | 'diagnosing' | 'fixing' | 'verifying' | 'resolved' | 'failed_to_fix';

// Example: Define a type for a detected bug
export interface BugReport {
  id: string;
  timestamp: string;
  source: string; // e.g., 'runtime', 'agent-X'
  errorLog: string;
  status: BugStatus;
  fixAttemptId?: string;
}

// Example: The state for the Bug agent
export interface BugAgentState {
  activeBugs: BugReport[];
  status: 'monitoring' | 'active_incident' | 'idle';
}

// Example: A function to initialize state
export function createInitialState(): BugAgentState {
  return {
    activeBugs: [],
    status: 'monitoring',
  };
}
