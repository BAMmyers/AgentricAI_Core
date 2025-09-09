/**
 * @file Data.ts
 * Data structures for the Sandbox Environment agent.
 */

// Example: Define a type for a sandbox execution result
export interface SandboxResult {
  executionId: string;
  inputCode: string;
  output: string;
  log: string[]; // Log of system calls or actions attempted inside the sandbox
  isMalicious: boolean;
}

// Example: The state for the sandbox manager
export interface SandboxState {
  activeSandboxes: string[]; // List of active sandbox IDs
  lastResult: SandboxResult | null;
  status: 'idle' | 'running' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): SandboxState {
  return {
    activeSandboxes: [],
    lastResult: null,
    status: 'idle',
  };
}
