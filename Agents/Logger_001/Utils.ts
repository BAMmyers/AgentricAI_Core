/**
 * @file Utils.ts
 * Utility and helper functions for the Logger_001 agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Formats a log entry into a standardized string format.
 * @param entry The log entry object.
 * @returns A formatted string.
 */
import { LogEntry } from './Data';

export function formatLogString(entry: LogEntry): string {
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.source}]: ${entry.message}`;
}
