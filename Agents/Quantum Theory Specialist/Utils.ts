
/**
 * @file Utils.ts
 * Utility functions for the Quantum Theory Specialist agent.
 */
import { Superposition } from './Data';

/**
 * A conceptual function to calculate the probability of measuring a specific state.
 * @param superposition The superposition of states.
 * @param stateLabel The label of the state to measure (e.g., '0' or '1').
 * @returns The probability (0 to 1).
 */
export function getMeasurementProbability(superposition: Superposition, stateLabel: string): number {
  const targetState = superposition.states.find(s => s.state.label === stateLabel);
  if (!targetState) {
    return 0;
  }
  // Probability is the square of the amplitude's magnitude.
  return Math.pow(Math.abs(targetState.amplitude), 2);
}
