
export type AgentStatus = 'idle' | 'thinking' | 'done' | 'error' | 'pending' | 'authorizing';
export type ToolName = 'python' | 'git' | 'fileSystem' | 'system' | 'imageGeneration' | 'audioGeneration';
export type MissionState = 'idle' | 'planning' | 'executing' | 'authorizing' | 'finished' | 'error';


export interface Agent {
    id: string;
    name: string;
    role: string;
    status: AgentStatus;
    tool?: ToolName;
    category: string;
    // FIX: Added missing 'logic' property.
    logic: 'gemini' | 'local';
}

export interface CollaborationStep {
    agentName: string;
    task: string;
    inputFrom?: string[];
}

export interface ChatMessage {
    id: string;
    type: 'user' | 'system' | 'agent-log' | 'agent-output' | 'final-response' | 'error';
    content: string;
    sender?: string;
    plan?: CollaborationStep[];
    imageUrl?: string;
    isSpeakable?: boolean;
}

export interface AuthorizationRequest {
    agent: Agent;
    task: string;
    onAllow: () => void;
    onDeny: () => void;
}

// --- LLM Studios API Contract ---

export interface LlmStudiosMissionRequest {
    missionId: string;
    objective: string;
    team: Agent[];
    chatHistory: ChatMessage[];
    executionResults: Record<string, string>;
    imageInputBase64?: string | null;
    authorizationGranted?: {
        agentName: string;
        task: string;
    };
}

export type LlmStudiosMissionResponse = {
    status: 'PLANNING' | 'EXECUTING' | 'AUTHORIZATION_REQUIRED' | 'FINISHED' | 'ERROR';
    agentName?: string;
    message?: string;
    plan?: CollaborationStep[];
    finalOutput?: string;
    imageUrl?: string;
    isSpeakable?: boolean;
    error?: string;
    authorizationRequest?: {
        agentName: string;
        task: string;
    };
};