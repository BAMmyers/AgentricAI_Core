
/**
 * @file Utils.ts
 * Utility and helper functions for the Data Sanitization Unit agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * A simple regex-based function to redact email addresses from a string.
 * @param text The input text.
 * @returns The text with email addresses replaced by '[REDACTED_EMAIL]'.
 */
export function redactEmails(text: string): string {
  const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
  return text.replace(emailRegex, '[REDACTED_EMAIL]');
}
