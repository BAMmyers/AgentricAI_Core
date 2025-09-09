/**
 * @file Services.ts
 * Core service logic for the Simulated Consciousness agent.
 */
import { simulatedDB } from './Db';
import { getCurrentTimestamp } from './Utils';
import { DataType, SimulatedDataRecord } from './Data';

class SimulatedConsciousnessService {
    logGeneratedData(
        missionId: string,
        sourceAgent: string,
        dataType: DataType,
        parameters: string | object,
        generatedData: string | object
    ): void {
        const record: Omit<SimulatedDataRecord, 'id'> = {
            missionId,
            timestamp: getCurrentTimestamp(),
            sourceAgent,
            dataType,
            parameters: typeof parameters === 'string' ? parameters : JSON.stringify(parameters),
            generatedData: typeof generatedData === 'string' ? generatedData : JSON.stringify(generatedData, null, 2),
        };
        simulatedDB.add(record);
    }
}

export const simulatedConsciousnessService = new SimulatedConsciousnessService();
