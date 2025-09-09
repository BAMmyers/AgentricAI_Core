/**
 * @file Utils.ts
 * Utility and helper functions for the Doppelganger agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */
import { Directive } from './Data';
/**
 * Verifies that a directive comes from an authorized governing agent.
 * @param directive The directive to check.
 * @returns True if the source is authorized.
 */
export function verifySource(directive: Directive): boolean {
  const authorizedSources = ['AgentricAI_001', 'Security_Sentinel_001', 'Mechanic Agent'];
  return authorizedSources.includes(directive.source);
}
