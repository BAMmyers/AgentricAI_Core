
/**
 * @file Utils.ts
 * Utility and helper functions for the System Process Manager agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */
import { OsProcess } from './Data';

/**
 * A conceptual function to parse raw output from a 'tasklist' or 'ps' command.
 * @param rawOutput The raw text output from the OS command.
 * @returns An array of OsProcess objects.
 */
export function parseProcessList(rawOutput: string): OsProcess[] {
  // This is a simplified parser for demonstration.
  const lines = rawOutput.trim().split('\n').slice(2); // Skip headers
  return lines.map((line, index) => {
    const parts = line.trim().split(/\s+/);
    return {
      pid: parseInt(parts[1], 10) || index,
      name: parts[0] || 'unknown',
      cpuUsage: 'N/A',
      memoryUsage: parts[4] ? `${parts[4]}K` : 'N/A',
    };
  });
}
