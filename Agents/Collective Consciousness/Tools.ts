/**
 * @file Tools.ts
 * Conceptual tools for operating on the Collective Consciousness data.
 */
import { collectiveDB } from './Db';

/**
 * Summarizes all operational events for a given mission.
 * @param missionId The ID of the mission to summarize.
 * @returns A string summary of the mission.
 */
export function summarizeMission(missionId: string): string {
    const records = collectiveDB.queryByMission(missionId);
    if (records.length === 0) {
        return `No records found for mission ${missionId}.`;
    }
    const summary = `Mission Summary for ${missionId}:\n` +
                    `Total Events: ${records.length}\n` +
                    `Start Time: ${records[0].timestamp}\n` +
                    `End Time: ${records[records.length - 1].timestamp}\n` +
                    `Final Output Source: ${records[records.length - 1].source}`;
    return summary;
}
