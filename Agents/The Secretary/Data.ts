/**
 * @file Data.ts
 * Data structures and state management for the The Secretary agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a note
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

// Example: Define a type for a reminder
export interface Reminder {
  id: string;
  text: string;
  dueAt: string;
}

// Example: The state for the secretary
export interface SecretaryState {
  notes: Note[];
  reminders: Reminder[];
  status: 'idle' | 'organizing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): SecretaryState {
  return {
    notes: [],
    reminders: [],
    status: 'idle',
  };
}
