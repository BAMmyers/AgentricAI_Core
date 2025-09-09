
/**
 * @file Data.ts
 * Data structures and state management for the Anomaly Detection Engine agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for an anomaly report
export interface AnomalyReport {
  metric: string;
  value: number;
  baseline: number;
  deviation: number;
}

// Example: The state for the engine
export interface EngineState {
  baselines: Record<string, number>;
  status: 'idle' | 'monitoring' | 'alerting' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): EngineState {
  return {
    baselines: {},
    status: 'idle',
  };
}
