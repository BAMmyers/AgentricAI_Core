
/**
 * @file Data.ts
 * Data structures for the Quantum Wave Specialist agent.
 */

// Represents a conceptual wave function.
export interface WaveFunction {
  // A mathematical expression describing the probability amplitude of a particle.
  expression: string; // e.g., 'Ψ(x,t) = A * e^(i(kx - ωt))'
  boundaryConditions: string;
}

// Represents the output of a quantum experiment.
export interface InterferencePattern {
  description: string;
  // A conceptual representation of the probability density.
  probabilityDistribution: number[]; 
}
