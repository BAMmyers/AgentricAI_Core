/**
 * @file Utils.ts
 * Utility and helper functions for the File Runner agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */
import { ProcessedFile } from './Data';
/**
 * Compiles content from all processed files into a single text block.
 * @param files An array of ProcessedFile objects.
 * @returns A single string with all content.
 */
export function compileContent(files: ProcessedFile[]): string {
  return files.map(file => `--- Content from ${file.path} ---\n${file.content}`).join('\n\n');
}
