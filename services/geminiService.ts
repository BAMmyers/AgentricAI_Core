

import { GoogleGenAI, Type } from "@google/genai";
import { Agent, CollaborationStep } from '../types.js';

export class QuotaExceededError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'QuotaExceededError';
    }
}

const handleGeminiError = (error: unknown, context: string): never => {
    console.error(`Error calling Gemini API during ${context}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        throw new QuotaExceededError(
            "**Quota Exceeded:** The application has made too many requests to the Gemini API. This is a limit set by Google. Please check your Google AI Platform billing and quota details, or wait a while before trying again."
        );
    }
    throw new Error(`Gemini API Error: ${errorMessage}`);
};


let ai: GoogleGenAI | null = null;
const getAi = (): GoogleGenAI => {
    if (!ai) {
        if (!process.env.API_KEY) {
            // This error will be thrown when an API call is first attempted, not on app load.
            throw new Error("API_KEY environment variable not set. The application cannot connect to Google services.");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};


const planSchema = {
    type: Type.OBJECT,
    properties: {
        isSimple: { type: Type.BOOLEAN },
        agentName: { type: Type.STRING, description: "Required if isSimple is true. The single agent to perform the task." },
        task: { type: Type.STRING, description: "Required if isSimple is true. The direct task for the single agent." },
        plan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    agentName: { type: Type.STRING },
                    task: { type: Type.STRING },
                },
                required: ["agentName", "task"]
            },
            description: "Required if isSimple is false. The full, multi-step plan."
        }
    },
    required: ["isSimple"]
};

const generateContent = async (prompt: string, schema?: any) => {
    try {
        const genAi = getAi();
        const response = await genAi.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: schema ? "application/json" : "text/plain",
                responseSchema: schema,
                temperature: 0.2,
            }
        });
        return response.text;
    } catch (error) {
        return handleGeminiError(error, "content generation");
    }
};


export const geminiService = {
    /**
     * Creates a prompt for a local LLM to generate a mission plan.
     * This prompt is more direct to ensure JSON output without schema support.
     */
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

    /**
     * Creates a prompt for an agent (local or Gemini) to execute a task.
     */
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

    async generatePlan(objective: string, team: Agent[]): Promise<CollaborationStep[]> {
        const teamList = team.map(a => `- ${a.name} (${a.logic}): ${a.role}`).join('\n');
        const prompt = `
Objective: "${objective}"

Available Team:
${teamList}

Analyze the objective and the available agents. Your goal is to create a JSON object that represents a plan to achieve the objective.

First, decide if this is a 'simple' task that can be handled by a single agent, or a 'complex' task requiring a multi-step plan.
- A task is 'simple' if it directly matches the role of a single agent and requires no further steps (e.g., "summarize this", "format this code", "analyze sentiment").
- A task is 'complex' if it requires multiple, distinct steps, collaboration, or a sequence of actions (e.g., "design and then code a function," "read a file and then summarize it", "write a story about a robot").

Based on your decision, structure your JSON output according to the provided schema.

- If the task is 'simple', set 'isSimple' to true. Then, provide the 'agentName' of the single agent best suited for the job, and a clear, concise 'task' for that agent to perform.
- If the task is 'complex', set 'isSimple' to false. Then, create a 'plan' which is an array of steps. Each step must have an 'agentName' and a 'task'. The plan should be a logical sequence of operations to achieve the main objective.

Make sure your final output is only the JSON object, adhering strictly to the schema.
`;

        const result = await generateContent(prompt, planSchema);
        try {
            const parsed = JSON.parse(result);
            if (parsed.isSimple) {
                return [{ agentName: parsed.agentName, task: parsed.task }];
            } else {
                return parsed.plan || [];
            }
        } catch (e) {
            console.error("Failed to parse plan from Gemini:", result);
            throw new Error("Received an invalid plan from the AI. Please try rephrasing your objective.");
        }
    },
    
    async runAgentTask(agent: Agent, task: string, context: string): Promise<string> {
        const prompt = this.createAgentPrompt(agent, task, context);
        return generateContent(prompt);
    },

    async analyzeImage(prompt: string, image: { base64: string, mimeType: string }): Promise<string> {
        try {
            const genAi = getAi();
            const imagePart = {
                inlineData: {
                    data: image.base64,
                    mimeType: image.mimeType,
                },
            };
            const textPart = {
                text: prompt,
            };

            const response = await genAi.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [imagePart, textPart] },
            });
            return response.text;
        } catch (error) {
            return handleGeminiError(error, "image analysis");
        }
    },

    async generateImage(prompt: string): Promise<string> {
        try {
            const genAi = getAi();
            const response = await genAi.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
            throw new Error("Image generation failed, no images returned.");
        } catch (error) {
            return handleGeminiError(error, "image generation");
        }
    },
};
