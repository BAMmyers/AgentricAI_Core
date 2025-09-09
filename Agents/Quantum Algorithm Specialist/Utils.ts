
/**
 * @file Utils.ts
 * Utility functions for the Quantum Algorithm Specialist agent.
 */
import { QuantumAlgorithm, AlgorithmStep } from './Data';

/**
 * A conceptual function to generate a high-level description of Grover's algorithm.
 * @param numQubits The number of qubits for the search space.
 * @returns A QuantumAlgorithm object describing Grover's algorithm.
 */
export function describeGroversAlgorithm(numQubits: number): QuantumAlgorithm {
  const searchSpace = 2**numQubits;
  const steps: AlgorithmStep[] = [
    { step: 1, description: 'Initialize n qubits to the |0⟩ state.', quantumOperation: 'Hadamard' },
    { step: 2, description: `Apply Hadamard gate to all ${numQubits} qubits to create a uniform superposition.`, quantumOperation: 'Hadamard' },
    { step: 3, description: 'Repeat O(√N) times:', quantumOperation: 'Oracle' },
    { step: 4, description: '  a. Apply the Oracle function, which marks the solution state(s).', quantumOperation: 'Oracle' },
    { step: 5, description: '  b. Apply the Grover diffusion operator (amplify the marked state).', quantumOperation: 'Hadamard' },
    { step: 6, description: 'Measure the qubits to obtain the solution state with high probability.', quantumOperation: 'Measurement' }
  ];

  return {
    name: "Grover's Algorithm",
    purpose: `Unstructured search for a target item in a search space of size N = ${searchSpace}.`,
    complexity: 'O(√N)',
    steps: steps,
  };
}
