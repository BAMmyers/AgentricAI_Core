/**
 * @file Utils.ts
 * Utility and helper functions for the Markdown Table Creator agent.
 * Contains logic that supports the agent's primary role but isn't part of the core operation.
 */
import { TableData } from './Data';

/**
 * Generates a markdown table string.
 * @param tableData The headers and rows for the table.
 * @returns A markdown table as a string.
 */
export function generateMarkdown(tableData: TableData): string {
  const { headers, rows } = tableData;
  const headerLine = `| ${headers.join(' | ')} |`;
  const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const rowLines = rows.map(row => `| ${row.join(' | ')} |`).join('\n');
  return `${headerLine}\n${separatorLine}\n${rowLines}`;
}
