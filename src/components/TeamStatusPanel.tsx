
import React from 'react';
import Panel from './Panel.tsx';
import { Agent, AgentStatus } from '../types/index.ts';

const TeamStatusPanel: React.FC<{ team: Agent[], missionLog: Record<string, AgentStatus>, onClearMemory: () => void, onOpenSettings: () => void }> = ({ team, missionLog, onClearMemory, onOpenSettings }) => {
    const getStatusIndicator = (status: AgentStatus) => {
        switch (status) {
            case 'thinking': return <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse-amber" title="Thinking"></div>;
            case 'authorizing': return <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse-cyan" title="Awaiting Authorization"></div>;
            case 'done': return <div className="w-3 h-3 rounded-full bg-green-500" title="Done"></div>;
            case 'error': return <div className="w-3 h-3 rounded-full bg-red-500" title="Error"></div>;
            case 'pending': return <div className="w-3 h-3 rounded-full bg-zinc-600" title="Pending"></div>;
            default: return <div className="w-3 h-3 rounded-full bg-zinc-700" title="Idle"></div>;
        }
    };

    return (
        <Panel>
            <div className="p-4 border-b border-zinc-700">
                <div className="flex justify-between items-center">
                    <h2 className="font-grotesk text-2xl text-zinc-100">Team Status</h2>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onClearMemory} 
                            className="text-zinc-400 hover:text-white transition-colors"
                            title="Clear Session Memory"
                            aria-label="Clear Session Memory"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                        </button>
                        <button 
                            onClick={onOpenSettings} 
                            className="text-zinc-400 hover:text-white transition-colors"
                            title="Settings & Operations"
                            aria-label="Open Settings"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0 .33 1.82V15a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </button>
                    </div>
                </div>
                <p className="text-zinc-400 text-sm">Monitor agent activity.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {team.length > 0 ? team.map(agent => (
                    <div key={agent.id} className="bg-zinc-900/50 p-3 rounded-md flex justify-between items-center">
                        <span className="text-zinc-200">{agent.name}</span>
                        {getStatusIndicator(missionLog[agent.name] || 'idle')}
                    </div>
                )) : (
                    <div className="text-center text-zinc-500 italic pt-8">No agents on team.</div>
                )}
            </div>
        </Panel>
    );
};

export default TeamStatusPanel;
