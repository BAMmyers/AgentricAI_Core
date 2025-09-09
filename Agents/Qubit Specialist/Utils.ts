
/**
 * @file Utils.ts
 * Utility functions for the Qubit Specialist agent.
 */
import { QubitState, BlochSphereCoordinates } from './Data';

/**
 * A conceptual function to convert qubit state amplitudes to Bloch sphere coordinates.
 * This is a simplified conversion for demonstration.
 * @param state The QubitState with alpha and beta amplitudes.
 * @returns The corresponding BlochSphereCoordinates.
 */
export function convertToBlochSphere(state: QubitState): BlochSphereCoordinates {
  // For |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
  // We can derive θ and φ from α and β. This is a simplification.
  const alphaMag = Math.sqrt(state.alpha.real**2 + state.alpha.imag**2);
  
  const theta = 2 * Math.acos(alphaMag);
  // φ is the phase difference between β and α.
  const phi = Math.atan2(state.beta.imag, state.beta.real) - Math.atan2(state.alpha.imag, state.alpha.real);

  return { theta, phi };
}
