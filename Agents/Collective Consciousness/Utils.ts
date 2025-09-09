/**
 * @file Utils.ts
 * Utility functions for the Collective Consciousness agent.
 */

export function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

export function generateUUID(): string {
    return `cc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
