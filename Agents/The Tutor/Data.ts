/**
 * @file Data.ts
 * Data structures and state management for the The Tutor agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a lesson plan
export interface Lesson {
  topic: string;
  explanation: string;
  question: string;
  answer: string;
}

// Example: The state for the tutor
export interface TutorState {
  currentLesson: Lesson | null;
  userProgress: Record<string, 'passed' | 'failed'>;
  status: 'idle' | 'teaching' | 'quizzing' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): TutorState {
  return {
    currentLesson: null,
    userProgress: {},
    status: 'idle',
  };
}
