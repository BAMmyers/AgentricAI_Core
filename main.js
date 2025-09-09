// main.js - Main process for the AgentricAI OS Shell (Electron)

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const http = require('http');
const https = require('https');
require('dotenv').config(); // Load .env file for API_KEY

// --- Mitigate potential cache access errors on startup ---
app.setPath('userData', path.join(app.getPath('appData'), app.getName()));
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');


// --- Gemini API Setup ---
const { GoogleGenAI, Type } = require('@google/genai');
let ai;
try {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not defined in your environment variables or .env file.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (e) {
    console.error("Fatal: Could not initialize GoogleGenAI. Gemini features will be disabled.", e);
}


// --- Global State for Local Models ---
let ollamaSettings = {
    endpoint: 'http://127.0.0.1:11434',
    model: 'llama3:latest'
};
let sdxl = {
    path: null,
};

// Placeholder for a locally generated image
const LOCAL_IMG_PLACEHOLDER_B64 = "PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMxZTFlMWUiLz48cGF0aCBkPSJNMzIgMCBBMzIgMzIgMCAwIDEgMzIgNjQiIHN0cm9rZT0iIzRmNDZlNSIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTMyIDY0IEEzMiAzMiAwIDAgMSAzMiAwIiBzdHJva2U9IiNhODU1ZjciIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWRhc2hhcnJheT0iOCA4Ii8+PHRleHQgeD0iNTAlIiB5PSI1NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJTcGFjZSBHcm90ZXNrLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjZTBlMGUwIj5MT0NBTDwvdGV4dD48L3N2Zz4=";


// --- Global Variables ---
let mainWindow = null;

// --- Core App Functionality ---
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 1000,
    minWidth: 1280,
    minHeight: 720,
    title: "AgentricAI",
    backgroundColor: '#111827', // Match body background
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'icon.png')
  });

  // Load the app directly as a file, not from a web server.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Build and set application menu
  const isMac = process.platform === 'darwin';
  const menuTemplate = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' }
        ]
    }
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

// --- IPC Handlers (Functions exposed to the frontend via preload.js) ---

async function handleUpdateOllamaSettings(event, newSettings) {
    console.log("Updating Ollama settings:", newSettings);
    ollamaSettings = newSettings;
    return { success: true };
}

async function handleOpenSafetensorsDialog() {
    if (!mainWindow) return { success: false, error: 'Main window not available.' };
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Safetensors Model File',
        properties: ['openFile'],
        filters: [{ name: 'Safetensors Models', extensions: ['safetensors'] }]
    });
    if (canceled || filePaths.length === 0) {
        return { success: false, error: 'File selection canceled.' };
    }
    const filePath = filePaths[0];
    console.log(`Loading Safetensors model from: ${filePath}`);
    sdxl.path = filePath;
    console.log("Safetensors model path has been set.");
    return { success: true, path: filePath };
}

async function handleUnloadSdModel() {
    if (sdxl.path) {
        console.log("Unloading Safetensors model...");
        sdxl.path = null;
        console.log("Safetensors model unloaded.");
    }
    return { success: true };
}

// A simple security check to prevent command injection.
const sanitizeCommand = (command) => {
    const forbiddenChars = /[;&|`$()<>]/g;
    if (forbiddenChars.test(command)) {
        console.warn(`Attempted command injection detected and blocked: ${command}`);
        return null;
    }
    return command;
};

async function handleExecuteTool(event, tool, task) {
    if (!tool || !task) {
        return { stdout: null, stderr: 'Missing tool or task in request' };
    }

    if (tool === 'local-llm') {
        return new Promise((resolve) => {
            const data = JSON.stringify({
                model: ollamaSettings.model,
                prompt: task,
                stream: false,
                format: "json",
            });

            const url = new URL(ollamaSettings.endpoint + '/api/generate');
            const protocol = url.protocol === 'https:' ? https : http;

            const options = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data),
                },
            };

            const req = protocol.request(options, (res) => {
                let responseBody = '';
                res.on('data', (chunk) => {
                    responseBody += chunk;
                });
                res.on('end', () => {
                    if (res.statusCode >= 400) {
                        resolve({ stdout: null, stderr: `Ollama server error (${res.statusCode}): ${responseBody}` });
                    } else {
                        try {
                            const parsed = JSON.parse(responseBody);
                            // Ollama's JSON mode nests the response string in another JSON string.
                            // We need to parse it twice.
                            const finalResponse = JSON.parse(parsed.response);
                            resolve({ stdout: JSON.stringify(finalResponse), stderr: null });
                        } catch (e) {
                             try {
                                // Fallback for non-JSON mode
                                const parsed = JSON.parse(responseBody);
                                resolve({ stdout: parsed.response, stderr: null });
                            } catch (e2) {
                                resolve({ stdout: null, stderr: `Failed to parse Ollama response: ${e2.message}` });
                            }
                        }
                    }
                });
            });

            req.on('error', (e) => {
                resolve({ stdout: null, stderr: `Failed to connect to Ollama server at ${ollamaSettings.endpoint}. Details: ${e.message}` });
            });

            req.write(data);
            req.end();
        });
    }
    
    if (tool === 'imageGeneration') {
        if (!sdxl.path) {
            return { stdout: null, stderr: 'Local Safetensors model is not loaded for image generation.' };
        }
        // This is the integration point for a local image generation script.
        // A real implementation would invoke a Python script here, passing `sdxl.path` as the model
        // and `task` as the prompt. The script would save an image, and this function
        // would return the base64-encoded result.
        console.log(`Executing local image generation with model: ${sdxl.path}`);
        console.log(`Prompt: ${task}`);

        // For now, returning a placeholder to confirm the local execution path was taken.
        return { stdout: LOCAL_IMG_PLACEHOLDER_B64, stderr: null };
    }

    let command;
    const options = { timeout: 15000 };
    let tempFilePath = '';

    switch (tool) {
        case 'python':
            tempFilePath = path.join(os.tmpdir(), `agentric_script_${Date.now()}.py`);
            fs.writeFileSync(tempFilePath, task);
            command = `python "${tempFilePath}"`;
            break;
        case 'git':
            const sanitizedGitCommand = sanitizeCommand(task);
            if (!sanitizedGitCommand || !sanitizedGitCommand.startsWith('git ')) {
                 return { stdout: null, stderr: 'Invalid or unsafe git command.' };
            }
            command = sanitizedGitCommand;
            break;
        case 'system':
            const sanitizedSystemCommand = sanitizeCommand(task);
            const allowedCommands = ['tasklist', 'ps', 'ls', 'dir', 'notepad', 'calc'];
            if (!sanitizedSystemCommand || !allowedCommands.some(c => sanitizedSystemCommand.startsWith(c))) {
                return { stdout: null, stderr: 'Disallowed or unsafe system command.' };
            }
            command = sanitizedSystemCommand;
            break;
        default:
            return { stdout: null, stderr: `Tool '${tool}' not supported.` };
    }

    return new Promise((resolve) => {
        exec(command, options, (error, stdout, stderr) => {
            if (tool === 'python' && fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            if (error) {
                console.error(`Execution error for tool ${tool}:`, error);
                resolve({ stdout, stderr: stderr || error.message });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

// --- Gemini IPC Handlers ---
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

async function handleGeneratePlan(event, objective, team) {
    if (!ai) return { error: "Gemini AI is not initialized. Check API_KEY." };
    const teamList = team.map(a => `- ${a.name} (${a.logic}): ${a.role}`).join('\n');
    const prompt = `
Objective: "${objective}"

Available Team:
${teamList}

Analyze the objective and the available agents. Your goal is to create a JSON object that represents a plan to achieve the objective.
First, decide if this is a 'simple' task that can be handled by a single agent, or a 'complex' task requiring a multi-step plan.
- A task is 'simple' if it directly matches the role of a single agent and requires no further steps.
- A task is 'complex' if it requires multiple, distinct steps or collaboration.
Based on your decision, structure your JSON output according to the provided schema.
- If 'simple', set 'isSimple' to true, and provide the 'agentName' and 'task'.
- If 'complex', set 'isSimple' to false, and create a 'plan' which is an array of steps.
Make sure your final output is only the JSON object, adhering strictly to the schema.
`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: planSchema,
                temperature: 0.2,
            }
        });
        return { planText: response.text };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("Gemini Plan Generation Error:", errorMessage);
        return { error: errorMessage };
    }
}

async function handleRunAgentTask(event, agent, task, context) {
    if (!ai) return { error: "Gemini AI is not initialized. Check API_KEY." };
    const prompt = `
You are the agent: ${agent.name}.
Your Role: ${agent.role}
Your assigned task is: "${task}"
Here is the context from previous steps in the mission:
---
${context}
---
Based on your role and the provided context, execute your task. Provide a concise and direct response containing only the result of your task.
`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "text/plain",
                temperature: 0.2,
            }
        });
        return { result: response.text };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error(`Gemini Task Error for ${agent.name}:`, errorMessage);
        return { error: errorMessage };
    }
}

async function handleAnalyzeImage(event, prompt, image) {
    if (!ai) return { error: "Gemini AI is not initialized. Check API_KEY." };
    try {
        const imagePart = { inlineData: { data: image.base64, mimeType: image.mimeType } };
        const textPart = { text: prompt };
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
        });
        return { result: response.text };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("Gemini Image Analysis Error:", errorMessage);
        return { error: errorMessage };
    }
}

async function handleGenerateImage(event, prompt) {
    if (!ai) return { error: "Gemini AI is not initialized. Check API_KEY." };
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
            },
        });
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return { result: `data:image/png;base64,${base64ImageBytes}` };
        }
        throw new Error("Image generation failed, no images returned.");
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("Gemini Image Generation Error:", errorMessage);
        return { error: errorMessage };
    }
}


// --- App Lifecycle Events ---
app.whenReady().then(() => {
  // Register all the IPC handlers that the frontend can invoke
  ipcMain.handle('update-ollama-settings', handleUpdateOllamaSettings);
  ipcMain.handle('open-safetensors-dialog', handleOpenSafetensorsDialog);
  ipcMain.handle('unload-sd-model', handleUnloadSdModel);
  ipcMain.handle('execute-tool', handleExecuteTool);
  
  // Gemini handlers
  ipcMain.handle('gemini-generate-plan', handleGeneratePlan);
  ipcMain.handle('gemini-run-agent-task', handleRunAgentTask);
  ipcMain.handle('gemini-analyze-image', handleAnalyzeImage);
  ipcMain.handle('gemini-generate-image', handleGenerateImage);

  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


app.on('window-all-closed', () => {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});