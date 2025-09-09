/**
 * @file Db.ts
 * In-memory database for the Theoretical Consciousness.
 */
import { TheoreticalConceptRecord } from './Data';
import { generateUUID } from './Utils';

const DB_KEY = 'agentric_theoretical_consciousness';

class TheoreticalDB {
    private records: Map<string, TheoreticalConceptRecord>;

    constructor() {
        this.records = this.loadFromLocalStorage();
    }

    private loadFromLocalStorage(): Map<string, TheoreticalConceptRecord> {
        try {
            const storedData = localStorage.getItem(DB_KEY);
            if (storedData) {
                const parsedData: [string, TheoreticalConceptRecord][] = JSON.parse(storedData);
                return new Map(parsedData);
            }
        } catch (error) {
            console.error('[Theoretical Consciousness] Error loading from localStorage:', error);
        }
        return new Map();
    }

    private saveToLocalStorage(): void {
        try {
            const dataToStore = JSON.stringify(Array.from(this.records.entries()));
            localStorage.setItem(DB_KEY, dataToStore);
        } catch (error) {
            console.error('[Theoretical Consciousness] Error saving to localStorage:', error);
        }
    }

    add(record: Omit<TheoreticalConceptRecord, 'id'>): TheoreticalConceptRecord {
        const id = generateUUID();
        const newRecord = { ...record, id };
        this.records.set(id, newRecord);
        this.saveToLocalStorage();
        console.log(`[Theoretical Consciousness] Logged concept: ${id} of type ${record.conceptType}`);
        return newRecord;
    }

    queryByMission(missionId: string): TheoreticalConceptRecord[] {
        const results: TheoreticalConceptRecord[] = [];
        this.records.forEach(record => {
            if (record.missionId === missionId) {
                results.push(record);
            }
        });
        return results.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
}

export const theoreticalDB = new TheoreticalDB();