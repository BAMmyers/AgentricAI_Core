
/**
 * @file Coms.ts
 * Communication layer for the Self-Review & Correction agent.
 */
export function formatOutput(data: any): string {
  return JSON.stringify({
    sender: 'Self-Review & Correction',
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
