/**
 * @file Data.ts
 * Data structures and state management for the File Runner agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a processed file
export interface ProcessedFile {
  path: string;
  content: string;
  type: 'text' | 'image-text';
}

// Example: The state for the file runner
export interface FileRunnerState {
  processedFiles: ProcessedFile[];
  status: 'idle' | 'running' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): FileRunnerState {
  return {
    processedFiles: [],
    status: 'idle',
  };
}
