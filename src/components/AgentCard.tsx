
import React from 'react';
import { Agent } from '../types/index.ts';

const AgentCard: React.FC<{
    agent: Agent;
    onToggleTeam: (agent: Agent) => void;
    isInTeam: boolean;
    isOfflineMode: boolean;
    isOfflineImageMode: boolean;
}> = ({ agent, onToggleTeam, isInTeam, isOfflineMode, isOfflineImageMode }) => {
    
    const isImageAgent = agent.tool === 'imageGeneration';

    // An agent is only disabled if it's for image generation and no local image model is loaded.
    // Text-based Gemini agents will now remain enabled and use the local Ollama model.
    const isDisabled = isImageAgent && !isOfflineImageMode;

    const getDisabledTitle = () => {
        if (isImageAgent && !isOfflineImageMode) {
            return 'To enable this agent, load a local .safetensors model in Settings.';
        }
        return agent.role;
    };

    const iconMap: Record<string, JSX.Element> = {
        python: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 flex-shrink-0"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
        git: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 flex-shrink-0"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" x2="6" y1="9" y2="15"/></svg>,
        fileSystem: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 flex-shrink-0"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
        system: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 flex-shrink-0"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
        imageGeneration: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
    };

    return (
    <div 
        className={`bg-zinc-900/50 rounded-lg p-3 border-2 border-transparent flex flex-col gap-2 transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800/80'}`}
        title={getDisabledTitle()}
    >
        <div className="flex justify-between items-start">
            <div className={`flex items-center gap-2 ${isDisabled ? 'text-zinc-500' : 'text-zinc-100'}`}>
                 {agent.tool && iconMap[agent.tool]}
                <h3 className="font-grotesk text-base pr-2">{agent.name}</h3>
            </div>
            <button
                onClick={(e) => { if (!isDisabled) { e.stopPropagation(); onToggleTeam(agent); } }}
                className={`flex-shrink-0 w-7 h-7 rounded-full text-xl flex items-center justify-center transition-all duration-200 ${
                    isInTeam && !isDisabled
                        ? 'bg-indigo-500 hover:bg-indigo-400 text-white transform rotate-45'
                        : `bg-zinc-700 text-zinc-300 ${!isDisabled && 'hover:bg-zinc-600 cursor-pointer'}`
                }`}
                aria-label={isInTeam ? 'Remove from team' : 'Add to team'}
                disabled={isDisabled}
            >
                {'+'}
            </button>
        </div>
        <p className={`text-sm italic ${isDisabled ? 'text-zinc-600' : 'text-zinc-400'}`}>"{agent.role}"</p>
    </div>
)};

export default AgentCard;
