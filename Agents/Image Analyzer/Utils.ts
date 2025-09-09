/**
 * @file Utils.ts
 * Utility and helper functions for the Image Analyzer agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */
import { ImageAnalysisResult } from './Data';

/**
 * Compiles extracted text from multiple images into a single report.
 * @param results An array of ImageAnalysisResult objects.
 * @returns A single formatted string.
 */
export function compileTextReport(results: ImageAnalysisResult[]): string {
  return results
    .map(res => `Text from "${res.fileName}":\n${res.extractedText}`)
    .join('\n\n---\n\n');
}
