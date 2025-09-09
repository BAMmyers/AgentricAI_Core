
import { Agent, CollaborationStep } from '../types.js';

// --- NATIVE TINY AI SERVICE ---
// This service provides offline, deterministic AI capabilities to reduce
// reliance on external APIs for simple tasks and planning. It also acts as a
// stand-in for a user-loaded GGUF model.

const simplePlanMappings: Record<string, { agent: string, task: (o: string) => string }> = {
    'summarize': { agent: 'Content Summarizer', task: (o) => `Summarize the following content: ${o.replace(/summarize/i, '').trim()}` },
    'sentiment': { agent: 'Sentiment Analyzer', task: (o) => `Analyze the sentiment of: ${o.replace(/sentiment for/i, '').trim()}` },
    'format': { agent: 'Format As Code', task: (o) => `Format the following content as a code block.` },
    'explain': { agent: 'Concept Explainer', task: (o) => `Explain the concept of: ${o.replace(/explain/i, '').trim()}` },
    'translate': { agent: 'Text Translator', task: (o) => `Translate: ${o.replace(/translate/i, '').trim()}` },
    'list pros and cons': { agent: 'Pros/Cons Lister', task: (o) => `List pros and cons for: ${o.replace(/list pros and cons for/i, '').trim()}` },
};

const generativeTemplates: Record<string, (task: string, context: string, provider: string) => string> = {
    'Default': (task, agentName, provider) => `[${provider}]: Agent **${agentName}** has completed the task: "${task}". The result is a text block with relevant information based on the provided mission context.`,
    'The Novelist': (task, context, provider) => `[${provider}]: Here is a short story about "${task.replace(/.*about/i, '').trim()}":\n\nIn a realm of digital dreams, a character embarked on a quest based on the mission's context. The journey was fraught with challenges, but ultimately led to a satisfying conclusion, reflecting the key themes found in the mission logs.`,
    'Concept Explainer': (task, context, provider) => `[${provider}]: The concept of "${task.replace(/.*of/i, '').trim()}" can be understood simply. It is a fundamental principle in its field, often compared to a well-known analogy. For example, in the context of our mission, it relates to how data is processed and transformed to achieve the final goal.`,
    'The Alchemist': (task, context, provider) => `[${provider}]: **Blueprint for "${task}":**\n\n1.  **Input Layer:** Receives data, similar to the initial objective.\n2.  **Processing Core:** Applies logic and transforms the data, much like the agents in this mission.\n3.  **Output Interface:** Presents the final, structured result.`,
    'Content Summarizer': (task, context, provider) => `[${provider}]: **Summary of Mission:**\nThe mission began with a clear objective. Several agents collaborated, each providing a piece of the solution. Key actions included data processing, analysis, and generation. The final outcome successfully addressed the initial prompt based on the provided context:\n\n*${context.substring(0, 250)}...*`,
    'Collector Alpha': (task, context, provider) => `[${provider}]: **Mission Synthesis:**\nBased on the collective mission log, the objective has been successfully met. All agent tasks completed, and the final results are compiled below, representing the successful execution of the plan.\n\n**Key Inputs:**\n*${context.substring(0, 300)}...*`,
};


class NativeTinyAIService {
    async generatePlan(objective: string, team: Agent[]): Promise<CollaborationStep[] | null> {
        const objectiveLower = objective.toLowerCase();
        
        // Complex tasks are deferred to Gemini
        const complexKeywords = ['design', 'develop', 'plan', 'create a full', 'multi-step', 'write a report', 'build', 'architect'];
        if (complexKeywords.some(k => objectiveLower.includes(k))) {
            return null;
        }

        for (const keyword in simplePlanMappings) {
            if (objectiveLower.startsWith(keyword)) {
                const mapping = simplePlanMappings[keyword];
                if (team.some(a => a.name === mapping.agent)) {
                    return [{ agentName: mapping.agent, task: mapping.task(objective) }];
                }
            }
        }
        
        // If no simple mapping is found, assume it's a complex single-step generative task
        // that can be handled by the best-suited agent.
        const bestAgent = team.find(a => a.logic === 'gemini' && !a.tool) || team.find(a => !a.tool);
        if (bestAgent) {
             return [{ agentName: bestAgent.name, task: objective }];
        }

        return null;
    }

    async executeTask(agent: Agent, task: string, context: string, provider: string): Promise<string> {
        const templateFn = generativeTemplates[agent.name] || (() => generativeTemplates['Default'](task, agent.name, provider));
        const result = templateFn(task, context, provider);
        // Simulate a small delay to make it feel like processing is happening
        await new Promise(res => setTimeout(res, 300 + Math.random() * 500));
        return Promise.resolve(result);
    }
}

export const nativeTinyAIService = new NativeTinyAIService();
