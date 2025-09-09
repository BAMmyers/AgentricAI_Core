
import React from 'react';
import { Settings } from '../types/index.ts';

const SettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onUpdateOllamaSettings: (endpoint: string, model: string) => void;
    onDisconnectOllama: () => void;
    onLoadSdModel: () => void;
    onUnloadSdModel: () => void;
}> = ({ isOpen, onClose, settings, onUpdateOllamaSettings, onDisconnectOllama, onLoadSdModel, onUnloadSdModel }) => {
    if (!isOpen) return null;

    const [endpoint, setEndpoint] = React.useState(settings.ollama?.endpoint || 'http://127.0.0.1:11434');
    const [model, setModel] = React.useState(settings.ollama?.model || 'llama3:latest');

    const handleSaveOllama = () => {
        onUpdateOllamaSettings(endpoint, model);
        onClose();
    };
    
    const sdModel = settings.sdModel;

    const getProviderStatus = (provider: 'text' | 'image') => {
        if (provider === 'text') {
            return settings.ollama?.status === 'configured' ? `Local (Ollama) - ${settings.ollama.model}` : 'Gemini API (Online)';
        }
        if (provider === 'image') {
            if (sdModel?.status === 'loaded') {
                const fileName = sdModel.path.split(/[\\/]/).pop() || 'Unknown File';
                return `Local Model (Offline) - ${fileName}`;
            }
            if (sdModel?.status === 'loading') return 'Local Model (Loading...)';
            return 'Gemini API (Online)';
        }
    };
    
    const getProviderDescription = (provider: 'text' | 'image') => {
        if (provider === 'text') {
             if (settings.ollama?.status === 'configured') return `Using model '${settings.ollama.model}' from the Ollama server at ${settings.ollama.endpoint}.`;
             return "Default online mode. Text tasks use the Gemini API. To run offline, configure and connect to a local Ollama server.";
        }
        if (provider === 'image') {
            if (sdModel?.status === 'loaded') return "Offline mode active. All image generation tasks are handled locally. Online-only agents are disabled.";
            if (sdModel?.status === 'loading') return "Please wait while the model is being loaded into memory...";
            if (sdModel?.status === 'error') return `Error loading model: ${sdModel.error}. Reverting to online mode.`;
            return "Default online mode. Image generation tasks use the Gemini API. To run fully offline, load a local .safetensors model.";
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-6 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 id="settings-title" className="font-grotesk text-2xl text-zinc-100">Framework Settings & Operations</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl" aria-label="Close settings">&times;</button>
                </div>

                <div className="space-y-6">
                    {/* Text Provider Section */}
                    <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <h3 className="font-grotesk text-lg text-indigo-400 mb-3">Text AI Provider</h3>
                        <div className="text-sm text-zinc-300 mb-4">
                            <p>Current: <strong className="text-white">{getProviderStatus('text')}</strong></p>
                            <p className="text-zinc-400 mt-1">{getProviderDescription('text')}</p>
                        </div>
                        <div className="space-y-3">
                           <div>
                                <label htmlFor="ollama-endpoint" className="block text-sm font-medium text-zinc-300 mb-1">Ollama Server Endpoint</label>
                                <input type="text" id="ollama-endpoint" value={endpoint} onChange={e => setEndpoint(e.target.value)} className="w-full bg-zinc-900 border border-zinc-600 rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                           </div>
                           <div>
                                <label htmlFor="ollama-model" className="block text-sm font-medium text-zinc-300 mb-1">Model Name</label>
                                <input type="text" id="ollama-model" value={model} onChange={e => setModel(e.target.value)} placeholder="e.g., llama3:latest or AgentricAI/AgentricAI_TLM:latest" className="w-full bg-zinc-900 border border-zinc-600 rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                           </div>
                           <div className="flex gap-2">
                               {settings.ollama?.status === 'configured' && (
                                   <button onClick={onDisconnectOllama} className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md hover:bg-zinc-600 transition-colors">Disconnect</button>
                               )}
                               <button onClick={handleSaveOllama} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors">Save and Apply</button>
                           </div>
                        </div>
                    </div>

                    {/* Image Generation Provider Section */}
                    <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <h3 className="font-grotesk text-lg text-indigo-400 mb-3">Image Generation Provider</h3>
                        <div className="text-sm text-zinc-300 mb-4">
                            <p>Current: <strong className="text-white">{getProviderStatus('image')}</strong></p>
                            <p className="text-zinc-400 mt-1">{getProviderDescription('image')}</p>
                        </div>
                        {sdModel?.status === 'loaded' ? (
                             <button onClick={onUnloadSdModel} className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md hover:bg-zinc-600">Unload Safetensors & Switch to Online</button>
                        ) : (
                             <button onClick={onLoadSdModel} disabled={sdModel?.status === 'loading'} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-wait">
                                {sdModel?.status === 'loading' ? 'Loading...' : 'Load Safetensors Model'}
                             </button>
                        )}
                    </div>

                    {/* Framework Operations Section */}
                    <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <h3 className="font-grotesk text-lg text-indigo-400 mb-2">Framework Operations</h3>
                        <p className="text-sm text-zinc-400 mb-3">Real-time counts from the session's Consciousness services.</p>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div><p className="text-2xl font-mono text-zinc-100">{settings.consciousnessCounts.collective}</p><p className="text-xs text-zinc-400">Collective (Logs)</p></div>
                            <div><p className="text-2xl font-mono text-zinc-100">{settings.consciousnessCounts.simulated}</p><p className="text-xs text-zinc-400">Simulated (Data)</p></div>
                            <div><p className="text-2xl font-mono text-zinc-100">{settings.consciousnessCounts.theoretical}</p><p className="text-xs text-zinc-400">Theoretical (Concepts)</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;