
/**
 * @file Data.ts
 * Data structures and state management for the File System Explorer agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a processed file
export interface ProcessedFile {
  path: string;
  content: string;
  type: 'text' | 'directory-listing';
}

// Example: The state for the file explorer
export interface FileExplorerState {
  processedFiles: ProcessedFile[];
  status: 'idle' | 'reading' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): FileExplorerState {
  return {
    processedFiles: [],
    status: 'idle',
  };
}
