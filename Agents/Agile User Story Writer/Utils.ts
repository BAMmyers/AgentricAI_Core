
/**
 * @file Utils.ts
 * Utility and helper functions for the Agile User Story Writer agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Formats the parts of a user story into the standard format.
 * @param persona The user persona.
 * @param action The desired action.
 * @param benefit The resulting benefit.
 * @returns The formatted user story string.
 */
export function formatStory(persona: string, action: string, benefit: string): string {
  return `As a ${persona}, I want to ${action}, so that ${benefit}.`;
}
