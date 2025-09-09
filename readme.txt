
# AgentricAI Core OS - README

## 1. Overview

AgentricAI Core OS is a web-based, desktop-integrated interface for assembling, commanding, and monitoring teams of specialized AI agents. It is designed to tackle complex, multi-step objectives by orchestrating a collaboration between different AI specialists.

The system leverages a hybrid intelligence model, utilizing Google's Gemini API (`gemini-2.5-flash`) for sophisticated planning and generative tasks, while routing simpler, deterministic jobs to a local logic service to optimize for speed and cost. This version is packaged as an Electron application to grant agents secure, user-authorized access to system-level tools for real-world execution.

## 2. Core Concepts

-   **Agents:** Specialized AI units defined in `agents.json`. Each agent has a specific `role`, `category`, and may be equipped with a `tool` (e.g., `python`, `git`, `fileSystem`, `system`) or have its own `logic` (`local` or `gemini`).

-   **Team Assembly:** The operator (user) selects a team of agents from the Agent Roster panel. Only agents on the active team can participate in a mission.

-   **Smart Dispatching (API Gateway):** When the operator submits an objective, the `API Gateway` agent is the first to act. It uses the Gemini API to analyze the request and determine if it can be fulfilled by a single, `local` agent. This is a crucial optimization step to conserve API calls.

-   **Complex Planning (Orchestrator):** If the objective is complex, the Gateway defers to a lead planner (like `Orchestrator Alpha`). The planner generates a step-by-step mission plan, delegating tasks to various agents on the team. This plan is visualized in the Mission Timeline.

-   **Tool Execution & Authorization:** Agents with `tool` capabilities (e.g., `Python Interpreter`, `Git Manager`, `System Process Manager`) cannot act autonomously. When it is their turn to execute a task, a modal appears, requiring the operator to explicitly **Allow** or **Deny** the action. This is the core security feature for all host system interactions.

-   **Hybrid Execution:**
    -   **Gemini Logic:** Agents marked as `gemini` (or without a `logic` property) have their tasks executed by making a call to the Gemini API, with a prompt constructed from their role, the task, and inputs from previous agents.
    -   **Local Logic:** Agents marked as `logic: 'local'` have their tasks executed by the `agentLogicService.ts`. This is for deterministic, common tasks (e.g., data formatting, simple analysis) that do not require generative AI.

## 3. Architecture

-   **Frontend:** A responsive `React/TypeScript` application that provides the three-panel user interface (Roster, Mission Control, Status).

-   **AI Service Integration:** All interactions with the Gemini API are handled through the official `@google/genai` SDK.

-   **Local Logic Service (`agentLogic.ts`):** A service that contains a map of agent names to specific TypeScript functions. This allows for fast, offline, and free execution of certain agent tasks.

-   **Backend Service (`backendService.ts`):** An abstraction layer for handling tool execution. It determines which tool is being called and routes the request appropriately.
    -   For `fileSystem`, it uses browser APIs to open file/directory pickers, a secure method that requires user interaction.
    -   For `python`, `git`, and `system` tools, it bridges to the Electron main process via the `preload.js` script.

-   **Electron Shell (`main.js`, `preload.js`):** The application is wrapped in Electron to provide capabilities beyond a standard web browser.
    -   `main.js`: The Node.js backend of the application. It listens for `execute-tool-command` events from the frontend. Upon receiving a request, it uses `child_process` to execute the command (`python`, `git`, `tasklist`, etc.) natively on the host OS and securely returns the `stdout` and `stderr`.
    -   `preload.js`: A secure script that exposes the `executeToolCommand` function from the main process to the React application (renderer process) without compromising context isolation.

## 4. Setup and Running the Application

This project is designed to run as an Electron application.

**Prerequisites:**
-   Node.js and npm
-   A valid Google Gemini API key
-   Python and Git installed and available in your system's PATH.

**Steps:**

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure API Key:**
    The application expects the Gemini API key to be available as an environment variable named `API_KEY`. The simplest way is to create a `.env` file in the project root and add `API_KEY=your_api_key_here`.
4.  **Start the application:**
    ```bash
    npm start
    ```

## 5. Project Structure

-   `/index.html`: The main entry point for the application.
-   `/index.tsx`: The root of the React application, containing all UI components and core application logic.
-   `/agents.json`: The canonical list of all available agents and their configurations.
-   `/services/`: Contains the logic for backend interaction (`backendService.ts`) and local agent execution (`agentLogic.ts`).
-   `/utils/`: Helper modules, such as the `fileHandler.ts` for interacting with the local file system.
-   `/main.js`: The Electron main process entry point. Handles window creation and IPC for executing real-world tool commands.
-   `/preload.js`: The Electron preload script, which securely exposes the `executeToolCommand` function to the React application.
-   `agentDefinitions.txt`: A human-readable summary of all agents in the roster.
