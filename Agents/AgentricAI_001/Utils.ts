/**
 * @file Utils.ts
 * Utility and helper functions for the AgentricAI_001 agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Validates if a target agent exists in the known roster.
 * @param agentName The name of the agent to check.
 * @param roster A list of available agent names.
 * @returns True if the agent is in the roster, false otherwise.
 */
export function validateTargetAgent(agentName: string, roster: string[]): boolean {
  return roster.includes(agentName);
}
