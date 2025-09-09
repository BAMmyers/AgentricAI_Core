
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

    // --- Private Methods ---
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

    // --- Public Methods ---

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

    // Collective Consciousness (Factual Logs)
    public logCollectiveEvent(missionId: string, logType: CollectiveLogRecord['logType'], source: string, content: string): void {
        const store = this.getStore<CollectiveLogRecord>(this.collectiveKey);
        store.push({ missionId, logType, source, content });
        this.setStore(this.collectiveKey, store);
    }

    // Simulated Consciousness (Generated Data)
    public logSimulatedData(missionId: string, sourceAgent: string, dataType: SimulatedDataRecord['dataType'], parameters: string, generatedData: string): void {
        const store = this.getStore<SimulatedDataRecord>(this.simulatedKey);
        store.push({ missionId, sourceAgent, dataType, parameters, generatedData });
        this.setStore(this.simulatedKey, store);
    }

    // Theoretical Consciousness (Ideas & Plans)
    public logTheoreticalConcept(missionId: string, sourceAgent: string, conceptType: TheoreticalConceptRecord['conceptType'], prompt: string, output: any): void {
        const store = this.getStore<TheoreticalConceptRecord>(this.theoreticalKey);
        store.push({ missionId, sourceAgent, conceptType, prompt, output });
        this.setStore(this.theoreticalKey, store);
    }

    /**
     * Gathers the most recent N outputs from a mission to build a context string.
     * @param missionId The ID of the current mission.
     * @param lastN The number of recent outputs to include.
     * @returns A string formatted as context for the next LLM call.
     */
    public getMissionContext(missionId: string, lastN: number): string {
        const simulatedStore = this.getStore<SimulatedDataRecord>(this.simulatedKey);
        const missionData = simulatedStore.filter(r => r.missionId === missionId);
        
        const recentOutputs = missionData.slice(-lastN);

        if (recentOutputs.length === 0) {
            return "No previous results in this mission yet.";
        }

        return recentOutputs.map(output => 
            `### Input from ${output.sourceAgent}:\n${output.generatedData}`
        ).join('\n\n');
    }
}

export const consciousnessService = new ConsciousnessService();
