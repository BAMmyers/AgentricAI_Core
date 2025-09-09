
/**
 * @file Utils.ts
 * Utility and helper functions for the Python Interpreter agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * A lightweight pre-execution validator for Python code syntax.
 * @param code The Python code string to check.
 * @returns True if the syntax seems plausible, false otherwise.
 */
export function basicSyntaxCheck(code: string): boolean {
  // This is a very basic check. A real implementation would be more complex.
  if (code.trim().length === 0) return false;
  const unbalancedBrackets = (code.split('(').length - 1) !== (code.split(')').length - 1);
  if (unbalancedBrackets) return false;
  return true;
}
