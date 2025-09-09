
/**
 * @file Data.ts
 * Data structures and state management for the API Doc Stubber agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for an API documentation stub
export interface DocStub {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  markdown: string;
}

// Example: The state for the stubber
export interface StubberState {
  lastStub: DocStub | null;
  status: 'idle' | 'generating' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): StubberState {
  return {
    lastStub: null,
    status: 'idle',
  };
}
