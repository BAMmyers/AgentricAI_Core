/**
 * @file Data.ts
 * Data structures for the Bit Force Action agent.
 */

// Example: Define a type for a network trace result
export interface TraceRouteHop {
  hop: number;
  ip: string;
  hostname?: string;
  latency: string;
}

// Example: Define a type for the final report
export interface ReconnaissanceReport {
  targetIp: string;
  timestamp: string;
  trace: TraceRouteHop[];
  whoisData: string;
  summary: string;
}

// Example: The state for the agent
export interface BitForceState {
  activeTarget: string | null;
  lastReport: ReconnaissanceReport | null;
  status: 'idle' | 'tracing' | 'reporting' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): BitForceState {
  return {
    activeTarget: null,
    lastReport: null,
    status: 'idle',
  };
}
