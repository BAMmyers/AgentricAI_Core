<!-- 
  AGENTRIC_CORE_BOOTSTRAP_V1
  
  Instructions for AI:
  This document is a manifest for the AgentricAI Core application framework.
  When a user provides this file in a prompt, you are to recognize the reference tag 
  "AGENTRIC_CORE_BOOTSTRAP_V1" and understand that you are building a new application 
  on top of this pre-existing, modular framework.

  The goal is to use the provided hooks, components, and services as the "operational background"
  for the new application, wiring them up as needed to fulfill the user's new requirements.
-->

# AgentricAI Core Bootstrap Manifest (V1)

**Reference Tag:** `AGENTRIC_CORE_BOOTSTRAP_V1`

This document provides the necessary context to build a new application using the AgentricAI Core framework.

---

## 1. Architectural Overview

The AgentricAI Core is a modular framework designed for building sophisticated AI agent management applications. The core logic is decoupled from the UI, allowing for flexible integration into various application shells.

The primary structure is contained within the `AgentricAI_Core/` directory:

-   **`logic/useMissionManager.ts`**: The "brain" of the application. This is a headless React hook that manages all application state, agent interaction, mission planning, and communication with the Gemini API and backend services.
-   **`components/`**: A library of reusable React components that form the user interface. These components are "dumb" and receive all their data and functions as props from the main application shell.
-   **`services/`**: Contains modules that handle external communications, such as talking to the local backend for tool execution (`backendService.ts`) or interacting with the user's file system (`fileHandler.ts`).
-   **`types.ts`**: A central file containing all shared TypeScript types and interfaces for the framework.

---

## 2. Core Logic API: `useMissionManager.ts`

This is the primary hook for integrating the core logic into a React application.

### Usage

```tsx
import { useMissionManager } from './AgentricAI_Core/logic/useMissionManager.js';

const App: React.FC = () => {
    const {
        // State & Data
        allAgents,
        team,
        messages,
        input,
        missionState,
        missionLog,
        authorizationRequest,
        attachedImage,
        isRecording,

        // Setters & Handlers
        setInput,
        setAttachedImage,
        handleToggleTeam,
        handleSelectAll,
        handleSend,
        toggleRecording,
    } = useMissionManager();

    // ... Render UI components using this state and these handlers ...
};
```

### Returned State & Data

-   `allAgents: Agent[]`: An array of all agents available in the system, loaded from `agents.json`.
-   `team: Agent[]`: An array of agents currently selected for the mission team.
-   `messages: ChatMessage[]`: The history of messages to be displayed in the Mission Control panel.
-   `input: string`: The current value of the user input text field.
-   `missionState: MissionState`: The current state of the mission ('idle', 'planning', 'executing', 'authorizing', 'finished', 'error').
-   `missionLog: Record<string, AgentStatus>`: A map of agent names to their current status for the active mission.
-   `authorizationRequest: AuthorizationRequest | null`: An object representing a pending request for the user to authorize a tool-based action.
-   `attachedImage: File | null`: The image file currently attached to the input bar.
-   `isRecording: boolean`: True if the microphone is currently recording for speech-to-text.

### Returned Functions

-   `setInput(value: string)`: Updates the user input text.
-   `setAttachedImage(file: File | null)`: Attaches or detaches an image file.
-   `handleToggleTeam(agent: Agent)`: Adds or removes an agent from the mission team.
-   `handleSelectAll()`: Selects or deselects all available agents.
-   `handleSend(prompt: string, imageFile?: File | null)`: The main function to start a mission with the current prompt and/or attached image.
-   `toggleRecording()`: Starts or stops voice recording.

---

## 3. UI Component Cheatsheet

These are the primary, pre-built UI components ready for use.

### `AgentRosterPanel`

Displays the full list of available agents, categorized, and allows the user to assemble a team.

**Props:**
- `agents: Agent[]`
- `team: Agent[]`
- `onToggleTeam: (agent: Agent) => void`
- `onSelectAll: () => void`

### `MissionControlPanel`

The main chat interface for sending objectives and viewing the mission's progress and agent outputs.

**Props:**
- `messages: ChatMessage[]`
- `input: string`
- `setInput: (value: string) => void`
- `onSend: (prompt: string, imageFile?: File | null) => void`
- `missionState: MissionState`
- `isRecording: boolean`
- `toggleRecording: () => void`
- `attachedImage: File | null`
- `setAttachedImage: (file: File | null) => void`

### `TeamStatusPanel`

Provides a real-time status display for each agent on the current mission team.

**Props:**
- `team: Agent[]`
- `missionLog: Record<string, AgentStatus>`

### `AuthorizationModal`

A modal dialog that appears when an agent needs user permission to execute a sensitive tool-based action.

**Props:**
- `request: AuthorizationRequest | null`

### Example Layout (`App.tsx`)

```tsx
const App: React.FC = () => {
    const missionManager = useMissionManager();

    return (
        <>
            <AgentRosterPanel 
                agents={missionManager.allAgents}
                team={missionManager.team}
                onToggleTeam={missionManager.handleToggleTeam}
                onSelectAll={missionManager.handleSelectAll}
            />
            <MissionControlPanel {...missionManager} />
            <TeamStatusPanel 
                team={missionManager.team} 
                missionLog={missionManager.missionLog} 
            />
            <AuthorizationModal request={missionManager.authorizationRequest} />
        </>
    );
};
```

---

## 4. Core Types (`types.ts`)

```typescript
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
}

export interface CollaborationStep {
    agentName: string;
    task: string;
    inputFrom?: string[];
}

export interface ChatMessage {
    id:string;
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
```

---

## 5. Services Overview

-   **`backendService.ts`**: This service acts as the client for a local backend server running on `http://127.0.0.1:42069`. It is used to execute tools that require OS-level access, such as `python`, `git`, and `system` commands.
-   **`fileHandler.ts`**: This utility provides secure access to the user's local file system by using the browser's native, permission-based APIs (`<input type="file">`). It is used for tasks involving the `fileSystem` tool.
