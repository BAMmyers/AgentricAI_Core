/**
 * @file Utils.ts
 * Utility functions for the Simulated Consciousness agent.
 */

export function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

export function generateUUID(): string {
    return `sc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
