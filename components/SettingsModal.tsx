
import React from 'react';
import { Settings } from '../types.ts';

const SettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onLoadGgufModel: () => void;
    onUnloadGgufModel: () => void;
    onLoadSdModel: () => void;
    onUnloadSdModel: () => void;
}> = ({ isOpen, onClose, settings, onLoadGgufModel, onUnloadGgufModel, onLoadSdModel, onUnloadSdModel }) => {
    if (!isOpen) return null;
    
    const ggufModel = settings.ggufModel;
    const sdModel = settings.sdModel;

    const getProviderStatus = (model: 'gguf' | 'sd') => {
        const selectedModel = model === 'gguf' ? ggufModel : sdModel;
        const onlineProvider = model === 'gguf' ? 'Gemini API (Online)' : 'Gemini API (Online)';
        
        if (selectedModel?.status === 'loaded') {
            const fileName = selectedModel.path.split(/[\\/]/).pop() || 'Unknown File';
            return `Local Model (Offline) - ${fileName}`;
        }
        if (selectedModel?.status === 'loading') return 'Local Model (Loading...)';
        return onlineProvider;
    };
    
    const getProviderDescription = (model: 'gguf' | 'sd') => {
        const selectedModel = model === 'gguf' ? ggufModel : sdModel;
        const onlineDesc = model === 'gguf' 
            ? "Default online mode. Complex text tasks use the Gemini API."
            : "Default online mode. Image generation tasks use the Gemini API.";

        if (selectedModel?.status === 'loaded') return "Offline mode active. All tasks of this type are handled locally. Online-only agents are disabled.";
        if (selectedModel?.status === 'loading') return "Please wait while the model is being loaded into memory...";
        if (selectedModel?.status === 'error') return `Error loading model: ${selectedModel.error}. Reverting to online mode.`;
        return `${onlineDesc} To run fully offline, load a local model.`;
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-6 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-grotesk text-2xl text-zinc-100">Framework Settings & Operations</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl">&times;</button>
                </div>

                <div className="space-y-6">
                    {/* Text Provider Section */}
                    <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <h3 className="font-grotesk text-lg text-indigo-400 mb-3">Text AI Provider</h3>
                        <div className="text-sm text-zinc-300 mb-4">
                            <p>Current: <strong className="text-white">{getProviderStatus('gguf')}</strong></p>
                            <p className="text-zinc-400 mt-1">{getProviderDescription('gguf')}</p>
                        </div>
                        {ggufModel?.status === 'loaded' ? (
                             <button onClick={onUnloadGgufModel} className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md hover:bg-zinc-600">Unload GGUF & Switch to Online</button>
                        ) : (
                             <button onClick={onLoadGgufModel} disabled={ggufModel?.status === 'loading'} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-wait">
                                {ggufModel?.status === 'loading' ? 'Loading...' : 'Load GGUF Model'}
                             </button>
                        )}
                    </div>

                    {/* Image Generation Provider Section */}
                    <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <h3 className="font-grotesk text-lg text-indigo-400 mb-3">Image Generation Provider</h3>
                        <div className="text-sm text-zinc-300 mb-4">
                            <p>Current: <strong className="text-white">{getProviderStatus('sd')}</strong></p>
                            <p className="text-zinc-400 mt-1">{getProviderDescription('sd')}</p>
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
