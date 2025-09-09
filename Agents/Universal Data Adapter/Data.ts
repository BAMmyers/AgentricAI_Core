/**
 * @file Data.ts
 * Data structures and state management for the Universal Data Adapter agent.
 * This file defines the shape of data this agent works with and manages.
 */

export type DataFormat = 'json' | 'xml' | 'csv' | 'plaintext';

// Example: Define a type for a transformation task
export interface TransformationTask {
  inputData: string;
  inputFormat: DataFormat;
  outputFormat: DataFormat;
}

// Example: The state for the adapter
export interface AdapterState {
  currentTask: TransformationTask | null;
  status: 'idle' | 'transforming' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): AdapterState {
  return {
    currentTask: null,
    status: 'idle',
  };
}
