
import { Agent, CollaborationStep } from '../types/index.ts';

export class QuotaExceededError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'QuotaExceededError';
    }
}

// Helper to process responses from the main process
const processIpcResponse = (response: { planText?: string; result?: string; error?: string; }, context: string) => {
    if (response.error) {
        console.error(`Error from main process during ${context}:`, response.error);
        if (response.error.includes('Quota') || response.error.includes('RESOURCE_EXHAUSTED')) {
            throw new QuotaExceededError(
                "**Quota Exceeded:** The application has made too many requests to the Gemini API. This is a limit set by Google. Please check your Google AI Platform billing and quota details, or wait a while before trying again."
            );
        }
        throw new Error(response.error);
    }
    return response.planText || response.result || '';
};


export const geminiService = {
    // These prompt creation functions are still used by useMissionManager for local LLM mode.
    createPlanPrompt(objective: string, team: Agent[]): string {
        const teamList = team.map(a => `- ${a.name} (${a.logic}): ${a.role}`).join('\n');
        return `
Objective: "${objective}"
Available Team:
${teamList}
Analyze the objective. Is it a 'simple' one-step task, or a 'complex' multi-step task?
- If simple, respond with a JSON object: {"isSimple": true, "agentName": "AGENT_NAME", "task": "TASK_FOR_AGENT"}
- If complex, respond with a JSON object: {"isSimple": false, "plan": [{"agentName": "AGENT_1", "task": "TASK_1"}, {"agentName": "AGENT_2", "task": "TASK_2"}]}
Your output must be ONLY the JSON object.
`;
    },

    createAgentPrompt(agent: Agent, task: string, context: string): string {
        return `
You are the agent: ${agent.name}.
Your Role: ${agent.role}
Your assigned task is: "${task}"
Here is the context from previous steps in the mission:
---
${context}
---
Based on your role and the provided context, execute your task. Provide a concise and direct response containing only the result of your task.
`;
    },

    async generatePlan(objective: string, team: Agent[]): Promise<string> {
        const response = await window.electronAPI.generatePlan(objective, team);
        return processIpcResponse(response, 'plan generation');
    },
    
    async runAgentTask(agent: Agent, task: string, context: string): Promise<string> {
        const response = await window.electronAPI.runAgentTask(agent, task, context);
        return processIpcResponse(response, `agent task for ${agent.name}`);
    },

    async analyzeImage(prompt: string, image: { base64: string, mimeType: string }): Promise<string> {
        const response = await window.electronAPI.analyzeImage(prompt, image);
        return processIpcResponse(response, 'image analysis');
    },

    async generateImage(prompt: string): Promise<string> {
        const response = await window.electronAPI.generateImage(prompt);
        return processIpcResponse(response, 'image generation');
    },
};
