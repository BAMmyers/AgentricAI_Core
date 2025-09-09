
/**
 * @file Utils.ts
 * Utility and helper functions for the Forced Stance Reporter agent.
 */
import { ThreatReport } from './Data';

/**
 * A conceptual function to format a report for a specific external database.
 * @param report The threat report to format.
 * @param targetDb The target database (e.g., 'VirusTotal').
 * @returns A formatted object or string ready for submission.
 */
export function formatForDatabase(report: ThreatReport, targetDb: 'VirusTotal' | 'abuse.ch'): any {
  // This is a simulation of formatting for an API call.
  if (targetDb === 'VirusTotal') {
    return {
      api_key: 'VT_API_KEY_PLACEHOLDER',
      resource: report.iocValue,
      comment: `Submitted by AgentricAI Forced Stance Reporter. Source: ${report.source}. Description: ${report.description}`
    };
  }
  if (targetDb === 'abuse.ch') {
     return `ioc=${report.iocValue}&type=${report.iocType}&comment=AgentricAI_Report`;
  }
  return report;
}
