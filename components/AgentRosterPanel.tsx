
import React, { useMemo } from 'react';
import Panel from './Panel.tsx';
import AgentCard from './AgentCard.tsx';
import { Agent } from '../types.ts';

const AgentRosterPanel: React.FC<{
    agents: Agent[];
    team: Agent[];
    onToggleTeam: (agent: Agent) => void;
    onSelectAll: () => void;
    isOfflineMode: boolean;
    isOfflineImageMode: boolean;
}> = ({ agents, team, onToggleTeam, onSelectAll, isOfflineMode, isOfflineImageMode }) => {
    const agentCategories = useMemo(() => {
        const categories: Record<string, Agent[]> = {};
        agents.forEach(agent => {
            if (!categories[agent.category]) {
                categories[agent.category] = [];
            }
            categories[agent.category].push(agent);
        });
        // Sort categories alphabetically for consistent order
        return Object.entries(categories).sort(([a], [b]) => a.localeCompare(b));
    }, [agents]);

    const areAllSelectableAgentsSelected = useMemo(() => {
        const selectableAgents = agents.filter(agent => {
            const isGeminiTextAgent = agent.logic === 'gemini';
            const isImageAgent = agent.tool === 'imageGeneration';
            const isTextDisabled = isGeminiTextAgent && isOfflineMode;
            const isImageDisabled = isImageAgent && !isOfflineImageMode;
            return !isTextDisabled && !isImageDisabled;
        });
        if (selectableAgents.length === 0) return false;
        return selectableAgents.every(agent => team.some(t => t.id === agent.id));
    }, [agents, team, isOfflineMode, isOfflineImageMode]);

    return (
        <Panel>
            <div className="p-4 border-b border-zinc-700">
                <div className="flex justify-between items-center mb-1">
                    <h2 className="font-grotesk text-2xl text-zinc-100">Agent Roster</h2>
                    <button
                        onClick={onSelectAll}
                        className="text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-3 py-1 rounded-md transition-colors"
                        aria-label={areAllSelectableAgentsSelected ? 'Deselect all agents' : 'Select all agents'}
                        disabled={agents.length === 0}
                    >
                        {areAllSelectableAgentsSelected ? 'Deselect All' : 'Select All'}
                    </button>
                </div>
                <p className="text-zinc-400 text-sm">Assemble your mission team.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {agentCategories.map(([category, agentList]) => (
                    <div key={category}>
                        <h3 className="font-grotesk text-lg text-indigo-400 mb-2">{category}</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {agentList.map(agent => (
                                <AgentCard
                                    key={agent.id}
                                    agent={agent}
                                    onToggleTeam={onToggleTeam}
                                    isInTeam={team.some(t => t.id === agent.id)}
                                    isOfflineMode={isOfflineMode}
                                    isOfflineImageMode={isOfflineImageMode}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Panel>
    );
};

export default AgentRosterPanel;
