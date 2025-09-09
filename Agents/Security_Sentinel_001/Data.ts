/**
 * @file Data.ts
 * Data structures and state management for the Security_Sentinel_001 agent.
 * This file defines the shape of data this agent works with and manages.
 */

export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

// Example: Define a type for a security event
export interface SecurityEvent {
  id: string;
  type: 'unauthorized_access' | 'malicious_code' | 'data_leak';
  threatLevel: ThreatLevel;
  details: Record<string, any>;
}

// Example: The state for the sentinel
export interface SentinelState {
  monitoredEvents: SecurityEvent[];
  status: 'monitoring' | 'alerting' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): SentinelState {
  return {
    monitoredEvents: [],
    status: 'monitoring',
  };
}
