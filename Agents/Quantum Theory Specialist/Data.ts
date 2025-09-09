
/**
 * @file Data.ts
 * Data structures for the Quantum Theory Specialist agent.
 */

// Represents a quantum state vector (ket) in Dirac notation.
export interface QuantumState {
  label: string;
  vector: number[]; // e.g., [1, 0] for |0⟩, [0, 1] for |1⟩
}

// Represents a superposition of states.
export interface Superposition {
  states: {
    state: QuantumState;
    amplitude: number; // The probability amplitude
  }[];
}

export interface TheorySpecialistState {
  activeSystem: Superposition | null;
  status: 'idle' | 'calculating' | 'error';
}
