
/**
 * @file Data.ts
 * Data structures and state management for the System Process Manager agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a single running process
export interface OsProcess {
  pid: number;
  name: string;
  cpuUsage: string;
  memoryUsage: string;
}

// Example: The state for the process manager
export interface ProcessManagerState {
  processList: OsProcess[];
  status: 'idle' | 'querying' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): ProcessManagerState {
  return {
    processList: [],
    status: 'idle',
  };
}
