// This service handles deterministic, local agent logic that does not require an LLM.

const localAgentFunctions: Record<string, (task: string, input: string) => Promise<string>> = {
    "Format As Code": async (task, input) => {
        const langMatch = task.match(/language:\s*(\w+)/);
        const lang = langMatch ? langMatch[1] : 'plaintext';
        return Promise.resolve("```" + lang + "\n" + input + "\n```");
    },
    "Markdown Table Creator": async (task, input) => {
        return Promise.resolve(`(Placeholder) A markdown table for "${task}" based on the input would be generated here.`);
    },
    "Sentiment Analyzer": async (task, input) => {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('happy') || lowerInput.includes('amazing') || lowerInput.includes('love')) {
            return Promise.resolve(`Sentiment: **Positive**`);
        }
        if (lowerInput.includes('sad') || lowerInput.includes('terrible') || lowerInput.includes('hate')) {
            return Promise.resolve(`Sentiment: **Negative**`);
        }
        return Promise.resolve(`Sentiment: **Neutral**`);
    },
    "Data Sanitization Unit": async (task, input) => {
        return Promise.resolve(input.replace(/\S+@\S+\.\S+/g, '[REDACTED_EMAIL]'));
    }
};

export const agentLogicService = {
    async execute(agentName: string, task: string, input: string): Promise<string> {
        if (localAgentFunctions[agentName]) {
            return localAgentFunctions[agentName](task, input);
        }
        console.warn(`No local logic found for agent: ${agentName}. Falling back to a generic response.`);
        return Promise.resolve(`(Placeholder) Local task "${task}" for agent "${agentName}" executed.`);
    }
};