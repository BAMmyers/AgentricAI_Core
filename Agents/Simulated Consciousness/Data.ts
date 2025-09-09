/**
 * @file Data.ts
 * Data structures for the Simulated Consciousness agent.
 */
export type DataType = 'json' | 'text' | 'code-snippet';

export interface SimulatedDataRecord {
  id: string;
  missionId: string;
  timestamp: string;
  sourceAgent: string; // The agent that generated the data
  dataType: DataType;
  parameters: string; // The prompt or task that led to generation
  generatedData: string;
}
