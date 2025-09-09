
/**
 * @file Data.ts
 * Data structures for the Quantum Energy Specialist agent.
 */

// Represents a discrete energy level in a quantum system.
export interface EnergyLevel {
  level: number; // e.g., n=1, n=2
  energyValue: number; // in electronvolts (eV) or other units
  isGroundState: boolean;
}

// Represents a transition between two energy levels.
export interface QuantumLeap {
  from: EnergyLevel;
  to: EnergyLevel;
  energyChange: number;
  result: 'photon_emitted' | 'photon_absorbed';
}
