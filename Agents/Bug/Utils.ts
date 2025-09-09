
/**
 * @file Utils.ts
 * Utility and helper functions for the Bug agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */
import { BugReport } from './Data';

/**
 * A conceptual function to analyze an error log and generate a diagnosis.
 * @param report The bug report containing the error log.
 * @returns A string with a summary of the likely problem.
 */
export function diagnoseError(report: BugReport): string {
  const log = report.errorLog.toLowerCase();
  if (log.includes('nullpointerexception') || log.includes('cannot read properties of undefined')) {
    return 'Diagnosis: Likely a null reference error. An object was expected but was not provided.';
  }
  if (log.includes('timeout') || log.includes('etimedout')) {
    return 'Diagnosis: Network timeout. A service may be unresponsive or the network connection is unstable.';
  }
  if (log.includes('permission denied') || log.includes('eacces')) {
    return 'Diagnosis: File system or resource permission error. The agent may lack the necessary rights to perform an action.';
  }
  return 'Diagnosis: Unknown error type. Requires deeper analysis.';
}
