/**
 * @file Utils.ts
 * Utility and helper functions for the PlantUML Diagram Generator agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */

/**
 * Wraps PlantUML code with the standard start and end tags.
 * @param code The PlantUML syntax.
 * @returns The complete PlantUML string.
 */
export function wrapWithUmlTags(code: string): string {
  return `@startuml\n${code}\n@enduml`;
}
