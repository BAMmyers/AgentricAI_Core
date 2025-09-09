/**
 * @file Utils.ts
 * Utility and helper functions for the Prompt Refiner agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Checks if a prompt is too short or vague.
 * @param prompt The prompt string to check.
 * @returns True if the prompt likely needs refinement.
 */
export function needsRefinement(prompt: string): boolean {
  return prompt.split(' ').length < 5;
}
