/**
 * @file Data.ts
 * Data structures and state management for the Visualizer agent.
 * This file defines the shape of data this agent works with and manages.
 */

export type ChartType = 'bar' | 'line' | 'pie';

// Example: Define a type for a visualization request
export interface VisRequest {
  type: 'chart' | 'ui_mockup' | 'layout';
  data: any;
  description: string;
}

// Example: The state for the visualizer
export interface VisualizerState {
  lastRequest: VisRequest | null;
  status: 'idle' | 'describing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): VisualizerState {
  return {
    lastRequest: null,
    status: 'idle',
  };
}
