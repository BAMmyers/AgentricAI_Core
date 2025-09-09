
/**
 * @file Data.ts
 * Data structures and state management for the Rapid Response Orchestrator agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a playbook step
export interface PlaybookStep {
  action: string;
  target: string; // e.g., agent name, system component
  params: Record<string, any>;
}

// Example: The state for an incident
export interface IncidentState {
  incidentId: string;
  playbook: PlaybookStep[];
  currentStep: number;
  status: 'active' | 'resolved' | 'failed';
}

// Example: A function to initialize state
export function createInitialState(incidentId: string, playbook: PlaybookStep[]): IncidentState {
  return {
    incidentId,
    playbook,
    currentStep: 0,
    status: 'active',
  };
}
