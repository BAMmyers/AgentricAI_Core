/**
 * @file Data.ts
 * Data structures and state management for the Data Connector agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a data source
export interface DataSource {
  id: string;
  data: any;
}

// Example: The state for the connector
export interface ConnectorState {
  inputs: DataSource[];
  output: any | null;
  status: 'idle' | 'merging' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): ConnectorState {
  return {
    inputs: [],
    output: null,
    status: 'idle',
  };
}
