/**
 * @file Utils.ts
 * Utility functions for the Theoretical Consciousness agent.
 */

export function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

export function generateUUID(): string {
    return `tc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
