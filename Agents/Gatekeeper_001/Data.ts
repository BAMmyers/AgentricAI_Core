/**
 * @file Data.ts
 * Data structures and state management for the Gatekeeper_001 agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for an access request
export interface AccessRequest {
  userId: string;
  resource: string;
  attemptedAction: 'read' | 'write' | 'delete';
}

// Example: The state for the gatekeeper
export interface GatekeeperState {
  log: string[];
  status: 'idle' | 'validating' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): GatekeeperState {
  return {
    log: [],
    status: 'idle',
  };
}
