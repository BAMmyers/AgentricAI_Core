/**
 * @file Utils.ts
 * Utility and helper functions for the Security_Sentinel_001 agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Analyzes an event to determine its threat level.
 * @param eventDetails Details of the security event.
 * @returns The calculated threat level.
 */
import { ThreatLevel } from './Data';

export function assessThreatLevel(eventDetails: Record<string, any>): ThreatLevel {
  // In a real implementation, this would involve complex analysis.
  if (eventDetails.critical) {
    return 'critical';
  }
  return 'low';
}
