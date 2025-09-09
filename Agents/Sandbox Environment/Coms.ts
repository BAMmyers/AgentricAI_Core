/**
 * @file Coms.ts
 * Communication layer for the Sandbox Environment agent.
 */
export function formatOutput(data: any): string {
  return JSON.stringify({
    sender: 'Sandbox Environment',
    timestamp: new Date().toISOString(),
    payload: data,
  }, null, 2);
}

export function parseInput(message: string): any {
  try {
    return JSON.parse(message);
  } catch (error) {
    return { task: message };
  }
}
