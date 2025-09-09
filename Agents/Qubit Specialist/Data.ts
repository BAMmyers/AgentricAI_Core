
/**
 * @file Data.ts
 * Data structures for the Qubit Specialist agent.
 */

// Represents the state of a single qubit using complex amplitudes.
// |ψ⟩ = α|0⟩ + β|1⟩, where |α|^2 + |β|^2 = 1.
export interface QubitState {
  alpha: { real: number, imag: number }; // Amplitude for |0⟩
  beta: { real: number, imag: number };  // Amplitude for |1⟩
}

// Represents the state of a qubit on the Bloch sphere.
export interface BlochSphereCoordinates {
  theta: number; // Polar angle (radians)
  phi: number;   // Azimuthal angle (radians)
}

export interface QubitSpecialistState {
  activeQubit: QubitState | null;
  status: 'idle' | 'defining' | 'error';
}
