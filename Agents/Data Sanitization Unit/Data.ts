
/**
 * @file Data.ts
 * Data structures and state management for the Data Sanitization Unit agent.
 * This file defines the shape of data this agent works with and manages.
 */

export type PiiType = 'email' | 'phone' | 'credit_card';

// Example: Define a type for a sanitization result
export interface SanitizationResult {
  originalData: string;
  sanitizedData: string;
  piiFound: PiiType[];
}

// Example: The state for the sanitizer
export interface SanitizerState {
  lastResult: SanitizationResult | null;
  status: 'idle' | 'sanitizing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): SanitizerState {
  return {
    lastResult: null,
    status: 'idle',
  };
}
