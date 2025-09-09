/**
 * @file Data.ts
 * Data structures and state management for the Mechanic Agent agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a system health check report
export interface HealthReport {
  agentName: string;
  status: 'healthy' | 'warning' | 'error';
  details: string;
}

// Example: The state for the mechanic
export interface MechanicState {
  systemHealth: HealthReport[];
  status: 'idle' | 'diagnosing' | 'repairing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): MechanicState {
  return {
    systemHealth: [],
    status: 'idle',
  };
}
