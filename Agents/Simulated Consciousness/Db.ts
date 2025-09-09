/**
 * @file Db.ts
 * In-memory database for the Simulated Consciousness.
 */
import { SimulatedDataRecord } from './Data';
import { generateUUID } from './Utils';

const DB_KEY = 'agentric_simulated_consciousness';

class SimulatedDB {
    private records: Map<string, SimulatedDataRecord>;

    constructor() {
        this.records = this.loadFromLocalStorage();
    }

    private loadFromLocalStorage(): Map<string, SimulatedDataRecord> {
        try {
            const storedData = localStorage.getItem(DB_KEY);
            if (storedData) {
                const parsedData: [string, SimulatedDataRecord][] = JSON.parse(storedData);
                return new Map(parsedData);
            }
        } catch (error) {
            console.error('[Simulated Consciousness] Error loading from localStorage:', error);
        }
        return new Map();
    }

    private saveToLocalStorage(): void {
        try {
            const dataToStore = JSON.stringify(Array.from(this.records.entries()));
            localStorage.setItem(DB_KEY, dataToStore);
        } catch (error) {
            console.error('[Simulated Consciousness] Error saving to localStorage:', error);
        }
    }

    add(record: Omit<SimulatedDataRecord, 'id'>): SimulatedDataRecord {
        const id = generateUUID();
        const newRecord = { ...record, id };
        this.records.set(id, newRecord);
        this.saveToLocalStorage();
        console.log(`[Simulated Consciousness] Logged record: ${id} from agent ${record.sourceAgent}`);
        return newRecord;
    }

    queryByAgent(agentName: string): SimulatedDataRecord[] {
        const results: SimulatedDataRecord[] = [];
        this.records.forEach(record => {
            if (record.sourceAgent === agentName) {
                results.push(record);
            }
        });
        return results.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
}

export const simulatedDB = new SimulatedDB();