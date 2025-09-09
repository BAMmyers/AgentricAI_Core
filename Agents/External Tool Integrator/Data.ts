/**
 * @file Data.ts
 * Data structures and state management for the External Tool Integrator agent.
 * This file defines the shape of data this agent works with and manages.
 */

export type SupportedTool = 'Blender' | 'Krita' | 'Photoshop';

// Example: Define a type for a tool command
export interface ToolCommand {
  tool: SupportedTool;
  command: string;
  args: Record<string, any>;
}

// Example: The state for the integrator
export interface IntegratorState {
  lastCommand: ToolCommand | null;
  status: 'idle' | 'communicating' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): IntegratorState {
  return {
    lastCommand: null,
    status: 'idle',
  };
}
