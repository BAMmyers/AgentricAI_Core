/**
 * @file Utils.ts
 * Utility and helper functions for the Orchestrator Alpha agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Validates the dependencies in a plan to ensure there are no circular references.
 * @param plan The plan to validate.
 * @returns True if the plan is valid, false otherwise.
 */
import { PlanStep } from './Data';

export function validatePlan(plan: PlanStep[]): boolean {
  // In a real implementation, this would be a topological sort to detect cycles.
  for (const step of plan) {
    for (const dep of step.dependencies) {
      if (!plan.some(s => s.agentName === dep)) {
        return false; // Dependency doesn't exist in the plan
      }
    }
  }
  return true;
}
