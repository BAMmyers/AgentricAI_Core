/**
 * @file Utils.ts
 * Utility and helper functions for the Sentiment Analyzer agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * A conceptual function to detect sentiment based on keywords.
 * @param text The text to analyze.
 * @returns The detected sentiment.
 */
import { Sentiment } from './Data';

export function simpleSentimentCheck(text: string): Sentiment {
  const lowerText = text.toLowerCase();
  const positiveWords = ['good', 'great', 'happy', 'love', 'excellent'];
  const negativeWords = ['bad', 'sad', 'terrible', 'hate', 'problem'];

  let score = 0;
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score++;
  });
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score--;
  });

  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}
