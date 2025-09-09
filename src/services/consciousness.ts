// --- SERVICES/CONSCIOUSNESS.TS ---
// This service manages the application's short-term memory using localStorage.
// It persists between sessions on the same browser.

interface CollectiveLogRecord {
  missionId: string;
  logType: 'user-input' | 'agent-task' | 'agent-output' | 'final-output' | 'system-message';
  source: string;
  content: string;
}

interface SimulatedDataRecord {
  missionId: string;
  sourceAgent: string;
  dataType: 'text' | 'json' | 'code';
  parameters: string;
  generatedData: string;
}

interface TheoreticalConceptRecord {
    missionId: string;
    sourceAgent: string;
    conceptType: 'plan' | 'idea';
    prompt: string;
    output: any;
}

class ConsciousnessService {
    private collectiveKey = 'agentric_collective_consciousness';
    private simulatedKey = 'agentric_simulated_consciousness';
    private theoreticalKey = 'agentric_theoretical_consciousness';

    private getStore<T>(key: string): T[] {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error(`Failed to parse localStorage for key ${key}:`, e);
            return [];
        }
    }

    private setStore<T>(key: string, data: T[]): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    public clearAllMemory(): void {
        localStorage.removeItem(this.collectiveKey);
        localStorage.removeItem(this.simulatedKey);
        localStorage.removeItem(this.theoreticalKey);
    }
    
    public getStoreCounts(): Record<string, number> {
        return {
            collective: this.getStore(this.collectiveKey).length,
            simulated: this.getStore(this.simulatedKey).length,
            theoretical: this.getStore(this.theoreticalKey).length,
        };
    }

    public logCollectiveEvent(missionId: string, logType: CollectiveLogRecord['logType'], source: string, content: string): void {
        const store = this.getStore<CollectiveLogRecord>(this.collectiveKey);
        store.push({ missionId, logType, source, content });
        this.setStore(this.collectiveKey, store);
    }

    public logSimulatedData(missionId: string, sourceAgent: string, dataType: SimulatedDataRecord['dataType'], parameters: string, generatedData: string): void {
        const store = this.getStore<SimulatedDataRecord>(this.simulatedKey);
        store.push({ missionId, sourceAgent, dataType, parameters, generatedData });
        this.setStore(this.simulatedKey, store);
    }

    public logTheoreticalConcept(missionId: string, sourceAgent: string, conceptType: TheoreticalConceptRecord['conceptType'], prompt: string, output: any): void {
        const store = this.getStore<TheoreticalConceptRecord>(this.theoreticalKey);
        store.push({ missionId, sourceAgent, conceptType, prompt, output });
        this.setStore(this.theoreticalKey, store);
    }
}

export const consciousnessService = new ConsciousnessService();