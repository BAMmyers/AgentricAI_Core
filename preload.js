// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object.
contextBridge.exposeInMainWorld('electronAPI', {
  // Local models and tools
  updateOllamaSettings: (settings) => ipcRenderer.invoke('update-ollama-settings', settings),
  openSafetensorsDialog: () => ipcRenderer.invoke('open-safetensors-dialog'),
  unloadSdModel: () => ipcRenderer.invoke('unload-sd-model'),
  executeTool: (tool, task) => ipcRenderer.invoke('execute-tool', tool, task),

  // Gemini API calls
  generatePlan: (objective, team) => ipcRenderer.invoke('gemini-generate-plan', objective, team),
  runAgentTask: (agent, task, context) => ipcRenderer.invoke('gemini-run-agent-task', agent, task, context),
  analyzeImage: (prompt, image) => ipcRenderer.invoke('gemini-analyze-image', prompt, image),
  generateImage: (prompt) => ipcRenderer.invoke('gemini-generate-image', prompt),
});