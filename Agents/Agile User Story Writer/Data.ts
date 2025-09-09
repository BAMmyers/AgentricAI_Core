
/**
 * @file Data.ts
 * Data structures and state management for the Agile User Story Writer agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a user story
export interface UserStory {
  persona: string;
  action: string;
  benefit: string;
  fullStory: string;
}

// Example: The state for the writer
export interface StoryWriterState {
  lastStory: UserStory | null;
  status: 'idle' | 'writing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): StoryWriterState {
  return {
    lastStory: null,
    status: 'idle',
  };
}
