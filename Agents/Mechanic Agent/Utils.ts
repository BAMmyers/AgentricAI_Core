/**
 * @file Utils.ts
 * Utility and helper functions for the Mechanic Agent agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Runs a diagnostic on an agent's code by performing a basic static analysis.
 * @param agentCode The code of the agent to check.
 * @returns A status string: 'healthy', 'warning', or 'error'.
 */
export function runDiagnostic(agentCode: string): 'healthy' | 'warning' | 'error' {
  if (agentCode.includes('TODO: FIX')) {
    return 'warning';
  }

  // Check for unbalanced brackets and parentheses - a common source of errors.
  const stack: string[] = [];
  const map: { [key: string]: string } = {
    '(': ')',
    '[': ']',
    '{': '}',
  };

  for (let i = 0; i < agentCode.length; i++) {
    const char = agentCode[i];
    if (map[char]) {
      stack.push(char);
    } else if (Object.values(map).includes(char)) {
      if (stack.length === 0 || map[stack.pop()!] !== char) {
        return 'error'; // Unbalanced closing bracket
      }
    }
  }

  if (stack.length > 0) {
    return 'error'; // Unbalanced opening bracket
  }

  return 'healthy';
}