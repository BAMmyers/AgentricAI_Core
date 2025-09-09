




export type AgentStatus = 'idle' | 'thinking' | 'done' | 'error' | 'pending' | 'authorizing';
export type ToolName = 'python' | 'git' | 'fileSystem' | 'system' | 'imageGeneration';
export type MissionState = 'idle' | 'planning' | 'executing' | 'authorizing' | 'finished' | 'error';

export interface Agent {
    id: string;
    name: string;
    role: string;
    status: AgentStatus;
    tool?: ToolName;
    category: string;
    logic: 'gemini' | 'local';
}

export interface CollaborationStep {
    agentName: string;
    task: string;
}

export interface ChatMessage {
    id: string;
    missionId?: string;
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

// --- Settings & Local Models ---

export interface LocalModel {
    path: string;
    status: 'loading' | 'loaded' | 'error' | 'unloaded' | 'downloading';
    error?: string;
    progress?: number;
}

export interface Settings {
    ggufModel: LocalModel | null;
    sdModel: LocalModel | null;
    consciousnessCounts: Record<string, number>;
}

// FIX: Augment the Window interface to make TypeScript aware of the electronAPI.
// FIX: Synced this interface with `src/types/index.ts` to resolve the declaration conflict.
declare global {
    interface Window {
        // FIX: Consolidated all properties from both conflicting declarations to create a single, unified interface.
        electronAPI: {
            updateOllamaSettings: (settings: { endpoint: string; model: string; }) => Promise<{ success: boolean; }>;
            openSafetensorsDialog: () => Promise<{ success: boolean; path?: string; error?: string; }>;
            unloadSdModel: () => Promise<{ success: boolean; }>;
            executeTool: (tool: string, task: string) => Promise<{ stdout: string | null; stderr: string | null; }>;
            generatePlan: (objective: string, team: Agent[]) => Promise<{ planText?: string; error?: string; }>;
            runAgentTask: (agent: Agent, task: string, context: string) => Promise<{ result?: string; error?: string; }>;
            analyzeImage: (prompt: string, image: { base64: string; mimeType: string; }) => Promise<{ result?: string; error?: string; }>;
            generateImage: (prompt: string) => Promise<{ result?: string; error?: string; }>;
            openGgufDialog: () => Promise<{ success: boolean; path?: string; error?: string; }>;
            unloadGgufModel: () => Promise<{ success: boolean; }>;
            downloadNativeModel: () => Promise<{ success: boolean; path?: string; error?: string; }>;
            onDownloadProgress: (callback: (progress: { progress: number; downloadedBytes: number; totalBytes: number; }) => void) => void;
        };
        // FIX: Added other global properties for consistency with src/types/index.ts
        bootManager: {
            start: () => void;
            stop: () => void;
        };
        marked: {
            parse: (markdown: string) => string;
        };
        DOMPurify: {
            sanitize: (html: string) => string;
        };
    }
}