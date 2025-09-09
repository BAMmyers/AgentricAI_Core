/**
 * @file Services.ts
 * Core service logic for the Theoretical Consciousness agent.
 */
import { theoreticalDB } from './Db';
import { getCurrentTimestamp } from './Utils';
import { ConceptType, TheoreticalConceptRecord } from './Data';

class TheoreticalConsciousnessService {
    logConcept(
        missionId: string,
        sourceAgent: string,
        conceptType: ConceptType,
        prompt: string | object,
        output: string | object
    ): void {
        const record: Omit<TheoreticalConceptRecord, 'id'> = {
            missionId,
            timestamp: getCurrentTimestamp(),
            sourceAgent,
            conceptType,
            prompt: typeof prompt === 'string' ? prompt : JSON.stringify(prompt),
            output: typeof output === 'string' ? output : JSON.stringify(output, null, 2),
        };
        theoreticalDB.add(record);
    }
}

export const theoreticalConsciousnessService = new TheoreticalConsciousnessService();
