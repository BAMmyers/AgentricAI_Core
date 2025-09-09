
/**
 * @file Data.ts
 * Data structures for the Forced Stance Reporter agent.
 */

export type IoCType = 'ip' | 'domain' | 'file_hash';

// Example: Define a type for a threat report to be submitted
export interface ThreatReport {
  iocType: IoCType;
  iocValue: string;
  source: string; // e.g., 'Bit Force Action', 'Tamper Detector'
  description: string;
}

// Example: The state for the reporter
export interface ReporterState {
  submissionQueue: ThreatReport[];
  lastSubmissionStatus: 'success' | 'failure' | null;
  status: 'idle' | 'reporting' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): ReporterState {
  return {
    submissionQueue: [],
    lastSubmissionStatus: null,
    status: 'idle',
  };
}
