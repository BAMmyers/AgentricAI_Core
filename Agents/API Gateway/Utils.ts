
/**
 * @file Utils.ts
 * Utility and helper functions for the API Gateway agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * A conceptual function to check if a prompt is complex based on keywords.
 * @param prompt The prompt to analyze.
 * @returns True if the prompt suggests a complex task.
 */
export function isComplexPrompt(prompt: string): boolean {
  const complexKeywords = [
    'design', 'develop', 'create a plan', 'write a story', 
    'analyze and report', 'multi-step', 'brainstorm', 'document'
  ];
  const lowerPrompt = prompt.toLowerCase();
  return complexKeywords.some(keyword => lowerPrompt.includes(keyword));
}
