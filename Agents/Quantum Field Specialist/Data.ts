
/**
 * @file Data.ts
 * Data structures for the Quantum Field Specialist agent.
 */
export type ParticleType = 'quark' | 'lepton' | 'boson';

// Represents a conceptual quantum field.
export interface QuantumField {
  name: string; // e.g., 'Electromagnetic Field'
  associatedParticle: string; // e.g., 'Photon'
  fieldValue: number; // Conceptual baseline value
}

// Represents an excitation of a field, i.e., a particle.
export interface FieldExcitation {
  field: QuantumField;
  particleType: ParticleType;
  energyLevel: number;
}
