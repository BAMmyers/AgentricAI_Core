
/**
 * @file Data.ts
 * Data structures and state management for the Threat Pattern Matcher agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a scan result
export interface ScanResult {
  inputData: string;
  isThreatFound: boolean;
  matchedPattern?: string;
}

// Example: The state for the matcher
export interface MatcherState {
  lastScan: ScanResult | null;
  status: 'idle' | 'scanning' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): MatcherState {
  return {
    lastScan: null,
    status: 'idle',
  };
}
