/**
 * @file Data.ts
 * Data structures and state management for the Image Analyzer agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for an image analysis result
export interface ImageAnalysisResult {
  fileName: string;
  extractedText: string;
}

// Example: The state for the analyzer
export interface ImageAnalyzerState {
  results: ImageAnalysisResult[];
  status: 'idle' | 'analyzing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): ImageAnalyzerState {
  return {
    results: [],
    status: 'idle',
  };
}
