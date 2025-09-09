/**
 * @file Utils.ts
 * Utility and helper functions for the SQL Query Explainer agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * A conceptual function to extract table names from a SQL query.
 * @param query The SQL query string.
 * @returns An array of table names.
 */
export function extractTables(query: string): string[] {
  const fromRegex = /from\s+(\w+)/ig;
  const joinRegex = /join\s+(\w+)/ig;
  const tables = new Set<string>();
  let match;
  while ((match = fromRegex.exec(query)) !== null) {
    tables.add(match[1]);
  }
  while ((match = joinRegex.exec(query)) !== null) {
    tables.add(match[1]);
  }
  return Array.from(tables);
}
