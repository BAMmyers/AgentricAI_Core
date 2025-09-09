
/**
 * @file Data.ts
 * Data structures for the Quantum Vacuum Specialist agent.
 */

// Represents a conceptual virtual particle-antiparticle pair.
export interface VirtualParticlePair {
  particle: string; // e.g., 'electron'
  antiparticle: string; // e.g., 'positron'
  lifetime: number; // in seconds (extremely short)
  energyFluctuation: number; // delta E
}

// Represents the Casimir effect between two plates.
export interface CasimirEffect {
  plateSeparation: number; // distance 'a'
  predictedForce: number; // Negative value indicates attraction
}
