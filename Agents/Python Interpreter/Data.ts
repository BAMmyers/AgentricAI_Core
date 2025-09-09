/**
 * @file Data.ts
 * Data structures and state management for the Python Interpreter agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a code execution result
export interface ExecutionResult {
  inputCode: string;
  output: string | null;
  error: string | null;
  success: boolean;
}

// Example: The state for the interpreter
export interface InterpreterState {
  executionHistory: ExecutionResult[];
  status: 'idle' | 'executing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): InterpreterState {
  return {
    executionHistory: [],
    status: 'idle',
  };
}
