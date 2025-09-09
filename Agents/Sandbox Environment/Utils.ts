/**
 * @file Utils.ts
 * Utility and helper functions for the Sandbox Environment agent.
 */
import { SandboxResult } from './Data';

/**
 * A conceptual function to analyze sandbox logs for malicious activity.
 * @param result The result of a sandbox execution.
 * @returns True if malicious activity is detected.
 */
export function analyzeSandboxLogs(result: SandboxResult): boolean {
  const maliciousKeywords = ['/etc/passwd', 'rm -rf', 'download_and_execute'];
  const combinedLogs = result.log.join('\n').toLowerCase();
  return maliciousKeywords.some(keyword => combinedLogs.includes(keyword));
}
