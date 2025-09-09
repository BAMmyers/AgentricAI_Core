/**
 * @file Data.ts
 * Data structures and state management for the Collector Alpha agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a collected piece of data
export interface CollectedData {
  sourceAgent: string;
  content: string;
}

// Example: The state for the collector
export interface CollectorState {
  dataBuffer: CollectedData[];
  summary: string | null;
  status: 'idle' | 'collecting' | 'summarizing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): CollectorState {
  return {
    dataBuffer: [],
    summary: null,
    status: 'idle',
  };
}
