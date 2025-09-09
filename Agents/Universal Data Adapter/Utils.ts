/**
 * @file Utils.ts
 * Utility and helper functions for the Universal Data Adapter agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Detects the format of the input data.
 * @param data The input data string.
 * @returns The detected data format.
 */
import { DataFormat } from './Data';

export function detectFormat(data: string): DataFormat {
  const trimmed = data.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
  if (trimmed.startsWith('<')) return 'xml';
  if (trimmed.includes(',')) return 'csv';
  return 'plaintext';
}
