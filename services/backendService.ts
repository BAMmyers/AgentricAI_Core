

// FIX: Removed the conflicting and incomplete global declaration for `window.electronAPI`.
// The correct and complete declaration is already provided in `types.ts`, which will be used globally.

export interface ToolExecutionParams {
    task: string;
    input: string;
}

export interface ToolExecutionResponse {
    stdout: string | null;
    stderr: string | null;
}

// FIX: Added 'fileSystem' to the list of supported tools.
type ToolName = 'python' | 'git' | 'system' | 'local-llm' | 'imageGeneration' | 'fileSystem';

/**
 * Executes a tool command by sending an IPC message to the Electron main process.
 * @param tool The name of the tool to execute.
 * @param task The specific command or task for the tool.
 * @returns A promise that resolves with the standard output and error from the command.
 */
const executeOnBackend = async (tool: ToolName, task: string): Promise<ToolExecutionResponse> => {
    try {
        if (!window.electronAPI || typeof window.electronAPI.executeTool !== 'function') {
            throw new Error("The 'electronAPI.executeTool' function is not available on the window object. Check the preload script.");
        }
        const response = await window.electronAPI.executeTool(tool, task);
        if (response.stderr) {
            console.error(`IPC tool execution error for ${tool}:`, response.stderr);
        }
        return response;
    } catch (error) {
        const errorMessage = `Fatal: IPC call to the main process failed for tool '${tool}'. Ensure the app is running in Electron.`;
        console.error(errorMessage, error);
        return { stdout: null, stderr: errorMessage };
    }
};

export const backendService = {
    /**
     * Executes a tool that requires OS-level shell access or local model inference
     * by invoking the main process via IPC.
     */
    async execute(tool: ToolName, params: ToolExecutionParams): Promise<ToolExecutionResponse> {
        // The `params.input` (context) is expected to be already embedded within the `params.task` string (the prompt)
        // by the time this service is called, particularly for local-llm.
        return executeOnBackend(tool, params.task);
    }
};