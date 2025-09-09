/**
 * @file Services.ts
 * Core service logic for the Collective Consciousness agent.
 */
import { collectiveDB } from './Db';
import { getCurrentTimestamp } from './Utils';
import { LogType, CollectiveLogRecord } from './Data';

class CollectiveConsciousnessService {
    logEvent(
        missionId: string,
        logType: LogType,
        source: string,
        content: string | object,
    ): void {
        const record: Omit<CollectiveLogRecord, 'id'> = {
            missionId,
            timestamp: getCurrentTimestamp(),
            logType,
            source,
            content: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
        };
        collectiveDB.add(record);
    }
}

export const collectiveConsciousnessService = new CollectiveConsciousnessService();
