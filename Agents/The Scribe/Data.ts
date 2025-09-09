/**
 * @file Data.ts
 * Data structures and state management for the The Scribe agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a document
export interface Document {
  id: string;
  title: string;
  content: string;
  version: string; // e.g., '1.0.0'
  lastModified: string;
}

// Example: The state for the scribe
export interface ScribeState {
  knowledgeBase: Document[];
  status: 'idle' | 'writing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): ScribeState {
  return {
    knowledgeBase: [],
    status: 'idle',
  };
}
