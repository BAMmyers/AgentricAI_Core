/**
 * @file Utils.ts
 * Utility and helper functions for the The Tutor agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Checks a user's answer against the correct answer.
 * @param userAnswer The answer provided by the user.
 * @param correctAnswer The correct answer.
 * @returns True if the answer is correct, false otherwise.
 */
export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  // Simple case-insensitive check
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}
