/**
 * @file Data.ts
 * Data structures and state management for the Sentiment Analyzer agent.
 * This file defines the shape of data this agent works with and manages.
 */

export type Sentiment = 'positive' | 'negative' | 'neutral';

// Example: Define a type for a sentiment analysis result
export interface SentimentAnalysis {
  text: string;
  sentiment: Sentiment;
  confidence: number; // 0 to 1
}

// Example: The state for the analyzer
export interface AnalyzerState {
  lastAnalysis: SentimentAnalysis | null;
  status: 'idle' | 'analyzing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): AnalyzerState {
  return {
    lastAnalysis: null,
    status: 'idle',
  };
}
