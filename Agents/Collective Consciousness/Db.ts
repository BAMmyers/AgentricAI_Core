/**
 * @file Db.ts
 * In-memory database for the Collective Consciousness.
 */
import { CollectiveLogRecord } from './Data';
import { generateUUID } from './Utils';

const DB_KEY = 'agentric_collective_consciousness';

class CollectiveDB {
    private records: Map<string, CollectiveLogRecord>;

    constructor() {
        this.records = this.loadFromLocalStorage();
    }

    private loadFromLocalStorage(): Map<string, CollectiveLogRecord> {
        try {
            const storedData = localStorage.getItem(DB_KEY);
            if (storedData) {
                const parsedData: [string, CollectiveLogRecord][] = JSON.parse(storedData);
                return new Map(parsedData);
            }
        } catch (error) {
            console.error('[Collective Consciousness] Error loading from localStorage:', error);
        }
        return new Map();
    }

    private saveToLocalStorage(): void {
        try {
            const dataToStore = JSON.stringify(Array.from(this.records.entries()));
            localStorage.setItem(DB_KEY, dataToStore);
        } catch (error) {
            console.error('[Collective Consciousness] Error saving to localStorage:', error);
        }
    }

    add(record: Omit<CollectiveLogRecord, 'id'>): CollectiveLogRecord {
        const id = generateUUID();
        const newRecord = { ...record, id };
        this.records.set(id, newRecord);
        this.saveToLocalStorage();
        console.log(`[Collective Consciousness] Logged record: ${id} for mission ${record.missionId}`);
        return newRecord;
    }
    
    queryByMission(missionId: string): CollectiveLogRecord[] {
        const results: CollectiveLogRecord[] = [];
        this.records.forEach(record => {
            if (record.missionId === missionId) {
                results.push(record);
            }
        });
        return results.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
}

export const collectiveDB = new CollectiveDB();