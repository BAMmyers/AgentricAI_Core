/**
 * @file Data.ts
 * Data structures and state management for the Text Translator agent.
 * This file defines the shape of data this agent works with and manages.
 */

// Example: Define a type for a translation result
export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

// Example: The state for the translator
export interface TranslatorState {
  lastTranslation: TranslationResult | null;
  status: 'idle' | 'translating' | 'error';
}

// Example: A function to initialize state
export function createInitialState(): TranslatorState {
  return {
    lastTranslation: null,
    status: 'idle',
  };
}
