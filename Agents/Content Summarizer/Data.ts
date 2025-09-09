/**
 * @file Data.ts
 * Data structures and state management for the Content Summarizer agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a summary result
export interface SummaryResult {
  originalText: string;
  summary: string;
  keywords: string[];
}

// Example: The state for the summarizer
export interface SummarizerState {
  lastResult: SummaryResult | null;
  status: 'idle' | 'summarizing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): SummarizerState {
  return {
    lastResult: null,
    status: 'idle',
  };
}
