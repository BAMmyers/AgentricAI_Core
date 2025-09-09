/**
 * @file Utils.ts
 * Utility and helper functions for the Drive agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */
import { DriveFile } from './Data';
/**
 * A conceptual search function for files.
 * @param files The list of files to search.
 * @param query The search query.
 * @returns An array of matching files.
 */
export function searchFiles(files: DriveFile[], query: string): DriveFile[] {
  const lowerQuery = query.toLowerCase();
  return files.filter(file => file.name.toLowerCase().includes(lowerQuery));
}
