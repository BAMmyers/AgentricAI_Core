
import { Agent, CollaborationStep } from '../types.js';

// --- LOCAL LLM SERVICE ---
// This service acts as a client to a user-provided, local LLM inference server
// (e.g., Ollama). It makes the application fully operational with a local model.

class LocalLlmService {

    private async generate(prompt: string, endpoint: string): Promise<string> {
        try {
            // Assumes an Ollama-compatible API
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // The model name is assumed to be loaded by the user in their server.
                    // We can make this configurable later if needed.
                    model: "agentric-model", 
                    prompt: prompt,
                    stream: false,
                    format: "json", // Crucial for reliable JSON output
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Local LLM server returned an error (${response.status}): ${errorBody}`);
            }

            const jsonResponse = await response.json();
            return jsonResponse.response; // This should be a JSON string
        } catch (error) {
            console.error("Error calling local LLM service:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to connect to local LLM server at ${endpoint}. Ensure the server is running and the endpoint is correct. Details: ${errorMessage}`);
        }
    }

    async generatePlan(objective: string, team: Agent[], endpoint: string): Promise<CollaborationStep[]> {
        const teamList = team.map(a => `- ${a.name} (${a.logic}): ${a.role}`).join('\n');
        
        // This prompt is specifically tailored for local models which might need more guidance
        // to produce clean JSON.
        const prompt = `
You are a master planner AI. Your task is to analyze an objective and create a JSON-formatted plan for a team of specialized agents.

**Objective:**
"${objective}"

**Available Team:**
${teamList}

**Instructions:**
1.  Analyze the objective carefully.
2.  Determine the sequence of steps required to accomplish the objective.
3.  Assign each step to the most appropriate agent from the available team.
4.  Your final output MUST be a valid JSON object containing a single key "plan".
5.  The "plan" key must be an array of objects, where each object has "agentName" and "task" string properties.
6.  Do not include any text, explanations, or markdown formatting outside of the main JSON object.

**Example Output:**
{
  "plan": [
    {
      "agentName": "The Alchemist",
      "task": "Create a blueprint for a Python sentiment analysis microservice."
    },
    {
      "agentName": "Snippet Coder",
      "task": "Write the main Python function for the sentiment analysis based on the blueprint."
    }
  ]
}

Now, generate the JSON plan for the given objective and team.
`;

        const result = await this.generate(prompt, endpoint);
        try {
            const parsed = JSON.parse(result);
            if (parsed.plan && Array.isArray(parsed.plan)) {
                return parsed.plan;
            } else {
                 throw new Error("Response was valid JSON but did not contain a 'plan' array.");
            }
        } catch (e) {
            console.error("Failed to parse plan from local LLM:", result, e);
            throw new Error("The local LLM returned an invalid or malformed plan. You may need to use a model fine-tuned for JSON output or check the server logs.");
        }
    }
    
    async runAgentTask(agent: Agent, task: string, context: string, endpoint: string): Promise<string> {
        const prompt = `
You are an AI agent with a specific role and task.

**Your Agent Persona:**
- Name: ${agent.name}
- Role: ${agent.role}

**Mission Context (from previous agents):**
---
${context}
---

**Your Assigned Task:**
"${task}"

**Instructions:**
1.  Assume your persona.
2.  Review the mission context.
3.  Execute your assigned task.
4.  Your output must be only the direct result of your task, in a concise and clear format. Do not add conversational fluff or explanations about what you did. Just provide the output.
`;
        const result = await this.generate(prompt, endpoint);
        // Local models can sometimes return a JSON string even when not asked. Try to parse it for cleaner output.
        try {
            const parsed = JSON.parse(result);
            // If the model wrapped its response, unwrap it.
            if(typeof parsed === 'object' && parsed !== null) {
                const keys = Object.keys(parsed);
                if (keys.length === 1) {
                    return typeof parsed[keys[0]] === 'string' ? parsed[keys[0]] : JSON.stringify(parsed[keys[0]], null, 2);
                }
                return JSON.stringify(parsed, null, 2);
            }
            return result;
        } catch (e) {
            // It's not JSON, so return the raw text.
            return result;
        }
    }
}

export const localLlmService = new LocalLlmService();
