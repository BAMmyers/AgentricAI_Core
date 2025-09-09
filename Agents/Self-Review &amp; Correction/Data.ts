
/**
 * @file Data.ts
 * Data structures for the Self-Review & Correction agent.
 */

export type AuditStatus = 'pass' | 'fail' | 'warning';

// Example: Define a type for a self-audit report
export interface AuditReport {
  checkId: string;
  checkName: string;
  status: AuditStatus;
  details: string;
  recommendation?: string;
}

// Example: The state for the agent
export interface SelfReviewState {
  lastAuditTimestamp: string;
  systemStatus: 'healthy' | 'degraded';
  activeAlerts: AuditReport[];
}
