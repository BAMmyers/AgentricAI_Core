/**
 * @file Coms.ts
 * Communication layer for the The Scribe agent.
 * This file standardizes how the agent formats output and parses input,
 * ensuring consistent data exchange within the AgentricAI framework.
 */

/**
 * Formats an output payload into a standardized message string.
 * This wraps the agent's data with sender identification and a timestamp.
 * @param data The payload to be sent by the agent.
 * @returns A JSON string representing the complete message.
 */
export function formatOutput(data: any): string {
  return JSON.stringify({
    sender: 'The Scribe',
    timestamp: new Date().toISOString(),
    payload: data,
  }, null, 2);
}

/**
 * Parses an incoming message string.
 * It attempts to parse the message as JSON. If parsing fails,
 * it safely wraps the raw message in a task object.
 * @param message The raw incoming message string.
 * @returns A parsed object, or a fallback task object.
 */
export function parseInput(message: string): any {
  try {
    return JSON.parse(message);
  } catch (error) {
    // Gracefully handle non-JSON input by treating it as a direct task.
    return { task: message };
  }
}
