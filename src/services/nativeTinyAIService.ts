import { Agent, CollaborationStep } from '../types/index.ts';

// --- NATIVE TINY AI SERVICE ---
// This service provides offline, deterministic AI capabilities to reduce
// reliance on external APIs for simple tasks and planning.

const simplePlanMappings: Record<string, { agent: string, task: (o: string) => string }> = {
    'summarize': { agent: 'Content Summarizer', task: (o) => `Summarize the following content: ${o.replace(/summarize/i, '').trim()}` },
    'sentiment': { agent: 'Sentiment Analyzer', task: (o) => `Analyze the sentiment of: ${o.replace(/sentiment for/i, '').trim()}` },
    'format': { agent: 'Format As Code', task: (o) => `Format the following content as a code block.` },
    'explain': { agent: 'Concept Explainer', task: (o) => `Explain the concept of: ${o.replace(/explain/i, '').trim()}` },
    'translate': { agent: 'Text Translator', task: (o) => `Translate: ${o.replace(/translate/i, '').trim()}` },
    'list pros and cons': { agent: 'Pros/Cons Lister', task: (o) => `List pros and cons for: ${o.replace(/list pros and cons for/i, '').trim()}` },
};

class NativeTinyAIService {
    async generatePlan(objective: string, team: Agent[]): Promise<CollaborationStep[] | null> {
        const objectiveLower = objective.toLowerCase();
        
        const complexKeywords = ['design', 'develop', 'plan', 'create a full', 'multi-step', 'write a report', 'build', 'architect'];
        if (complexKeywords.some(k => objectiveLower.includes(k))) {
            return null; // Defer complex tasks to a real LLM
        }

        for (const keyword in simplePlanMappings) {
            if (objectiveLower.startsWith(keyword)) {
                const mapping = simplePlanMappings[keyword];
                if (team.some(a => a.name === mapping.agent)) {
                    return [{ agentName: mapping.agent, task: mapping.task(objective) }];
                }
            }
        }
        
        const bestAgent = team.find(a => a.logic === 'gemini' && !a.tool) || team.find(a => !a.tool);
        if (bestAgent) {
             return [{ agentName: bestAgent.name, task: objective }];
        }

        return null;
    }
}

export const nativeTinyAIService = new NativeTinyAIService();