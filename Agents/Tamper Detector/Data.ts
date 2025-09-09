/**
 * @file Data.ts
 * Data structures for the Tamper Detector agent.
 */

// Example: Define a type for an integrity check report
export interface IntegrityReport {
  target: string; // e.g., file path or agent ID
  expectedChecksum: string;
  actualChecksum: string;
  isTampered: boolean;
}

// Example: The state for the detector
export interface DetectorState {
  lastReport: IntegrityReport | null;
  status: 'idle' | 'monitoring' | 'alerting' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): DetectorState {
  return {
    lastReport: null,
    status: 'monitoring',
  };
}
