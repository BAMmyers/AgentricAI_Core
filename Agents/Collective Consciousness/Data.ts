/**
 * @file Data.ts
 * Data structures for the Collective Consciousness agent.
 */

export type LogType = 'user-input' | 'system-message' | 'agent-task' | 'agent-output' | 'final-output' | 'error';

export interface CollectiveLogRecord {
  id: string;
  missionId: string;
  timestamp: string;
  logType: LogType;
  source: string; // e.g., 'Operator', 'AgentricAI_001', 'Python Interpreter'
  content: string; // The core data or message
}
