/**
 * @file Data.ts
 * Data structures and state management for the Quick Email Drafter agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for an email draft
export interface EmailDraft {
  recipient?: string;
  subject: string;
  body: string;
  tone: 'professional' | 'casual' | 'urgent';
}

// Example: The state for the drafter
export interface DrafterState {
  lastDraft: EmailDraft | null;
  status: 'idle' | 'drafting' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): DrafterState {
  return {
    lastDraft: null,
    status: 'idle',
  };
}
