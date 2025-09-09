
/**
 * @file Data.ts
 * Data structures and state management for the API Gateway agent.
 * This file defines the shape of data this agent works with and manages.
 */

export type ExecutionDecision = 'local' | 'gemini';

// Example: Define a type for the analysis result from the gateway
export interface AnalysisResult {
  decision: ExecutionDecision;
  agentName?: string; // The chosen agent if decision is 'local'
  task?: string;      // The task for the chosen agent
}

// Example: The state for the API Gateway
export interface GatewayState {
  lastAnalysis: AnalysisResult | null;
  status: 'idle' | 'analyzing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): GatewayState {
  return {
    lastAnalysis: null,
    status: 'idle',
  };
}
