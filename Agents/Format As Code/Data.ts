/**
 * @file Data.ts
 * Data structures and state management for the Format As Code agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a formatting request
export interface FormatRequest {
  text: string;
  language?: string; // Optional: if not provided, auto-detect
}

// Example: The state for the formatter
export interface FormatterState {
  lastRequest: FormatRequest | null;
  status: 'idle' | 'formatting' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): FormatterState {
  return {
    lastRequest: null,
    status: 'idle',
  };
}
