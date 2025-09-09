/**
 * @file Tools.ts
 * Conceptual tools for operating on the Theoretical Consciousness data.
 */
import { theoreticalDB } from './Db';
import { TheoreticalConceptRecord } from './Data';

/**
 * Finds related concepts within a mission based on keywords.
 * @param missionId The ID of the mission.
 * @param keywords A list of keywords to search for.
 * @returns A list of related concepts.
 */
export function findRelatedConcepts(missionId: string, keywords: string[]): TheoreticalConceptRecord[] {
    const records = theoreticalDB.queryByMission(missionId);
    return records.filter(record => 
        keywords.some(keyword => record.prompt.includes(keyword) || record.output.includes(keyword))
    );
}
