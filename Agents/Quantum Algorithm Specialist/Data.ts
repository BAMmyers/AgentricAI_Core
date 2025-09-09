
/**
 * @file Data.ts
 * Data structures for the Quantum Algorithm Specialist agent.
 */

export interface AlgorithmStep {
  step: number;
  description: string;
  quantumOperation: 'Hadamard' | 'QFT' | 'Oracle' | 'Measurement';
}

// Represents the conceptual structure of a quantum algorithm.
export interface QuantumAlgorithm {
  name: string;
  purpose: string;
  complexity: string; // e.g., 'O(log N)'
  steps: AlgorithmStep[];
}

export interface AlgorithmSpecialistState {
  currentAlgorithm: QuantumAlgorithm | null;
  status: 'idle' | 'explaining' | 'error';
}
