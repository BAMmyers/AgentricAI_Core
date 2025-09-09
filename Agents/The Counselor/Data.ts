/**
 * @file Data.ts
 * Data structures and state management for the The Counselor agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a conversation turn
export interface DialogueTurn {
  speaker: 'user' | 'agent';
  text: string;
  timestamp: string;
}

// Example: The state for the counselor
export interface CounselorState {
  conversationHistory: DialogueTurn[];
  status: 'idle' | 'listening' | 'responding' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): CounselorState {
  return {
    conversationHistory: [],
    status: 'idle',
  };
}
