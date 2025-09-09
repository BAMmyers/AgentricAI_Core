
/**
 * @file Data.ts
 * Data structures and state management for the Application Launcher agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a launch request
export interface LaunchRequest {
  applicationName: string;
  args: string[];
}

// Example: The state for the launcher
export interface LauncherState {
  lastLaunched: LaunchRequest | null;
  status: 'idle' | 'launching' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): LauncherState {
  return {
    lastLaunched: null,
    status: 'idle',
  };
}
