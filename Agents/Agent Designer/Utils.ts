/**
 * @file Utils.ts
 * Utility and helper functions for the Agent Designer agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */
import { AgentSpec } from './Data';
/**
 * Validates a generated agent specification.
 * @param spec The AgentSpec object to validate.
 * @returns True if the spec is valid.
 */
export function validateAgentSpec(spec: AgentSpec): boolean {
  return spec.name.trim().length > 0 && spec.role.trim().length > 0;
}
