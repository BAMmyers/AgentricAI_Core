
/**
 * @file Utils.ts
 * Utility functions for the Self-Review & Correction agent.
 */

/**
 * A conceptual function to check the integrity of the importmap.
 * @param importMap The importmap object from index.html.
 * @returns An object with status and details.
 */
export function checkImportMapIntegrity(importMap: { imports: Record<string, string> }): { status: 'pass' | 'fail', details: string } {
  const imports = importMap.imports;
  for (const key in imports) {
    // Check for problematic path specifiers
    if (key.startsWith('./') || key.startsWith('../') || key.startsWith('/')) {
      return {
        status: 'fail',
        details: `Found problematic relative-like path specifier in import map: "${key}". Use bare specifiers only.`
      };
    }
    const value = imports[key];
    if (!value.startsWith('./') && !value.startsWith('https://')) {
       return {
        status: 'fail',
        details: `Mapped path for "${key}" is not a valid relative path or URL: "${value}".`
      };
    }
  }
  return {
    status: 'pass',
    details: 'Import map configuration appears stable and robust.'
  };
}
