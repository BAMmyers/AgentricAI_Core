/**
 * @file Data.ts
 * Data structures and state management for the Logger_001 agent.
 * This file defines the shape of data this agent works with and manages.
 */

export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

// Example: Define a type for a log entry
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
}

// Example: The state for the logger
export interface LoggerState {
  logBuffer: LogEntry[];
  status: 'idle' | 'logging' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): LoggerState {
  return {
    logBuffer: [],
    status: 'idle',
  };
}
