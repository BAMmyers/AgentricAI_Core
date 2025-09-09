
/**
 * @file Utils.ts
 * Utility and helper functions for the Rapid Response Orchestrator agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Selects the appropriate playbook based on the incident type.
 * @param incidentType The type of incident (e.g., 'data_leak', 'unauthorized_access').
 * @returns The name of the playbook to execute.
 */
export function selectPlaybook(incidentType: string): string {
  switch (incidentType) {
    case 'data_leak':
      return 'playbook_contain_data_leak';
    case 'unauthorized_access':
      return 'playbook_revoke_access';
    default:
      return 'playbook_generic_triage';
  }
}
