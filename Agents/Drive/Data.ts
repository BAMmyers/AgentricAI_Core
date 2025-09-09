/**
 * @file Data.ts
 * Data structures and state management for the Drive agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a conceptual file from Drive
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

// Example: The state for the drive agent
export interface DriveState {
  fileList: DriveFile[];
  status: 'idle' | 'searching' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): DriveState {
  return {
    fileList: [],
    status: 'idle',
  };
}
