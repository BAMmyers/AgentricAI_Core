/**
 * @file Data.ts
 * Data structures and state management for the Data Extractor agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for an extraction result
export interface ExtractionResult {
  sourceText: string;
  extractedData: Record<string, string[]>; // e.g., { emails: [...], dates: [...] }
}

// Example: The state for the extractor
export interface ExtractorState {
  lastResult: ExtractionResult | null;
  status: 'idle' | 'extracting' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): ExtractorState {
  return {
    lastResult: null,
    status: 'idle',
  };
}
