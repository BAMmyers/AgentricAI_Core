/**
 * @file Utils.ts
 * Utility and helper functions for the Quick Email Drafter agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Adds a standard signature to the email body.
 * @param body The body of the email.
 * @returns The body with a signature appended.
 */
export function addSignature(body: string): string {
  const signature = "\n\nBest regards,\nAgent";
  return body + signature;
}
