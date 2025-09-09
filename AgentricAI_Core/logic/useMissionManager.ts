import { useState, useEffect, useRef } from 'react';
import { llmStudiosService } from '../services/llmStudiosService.js';
import { fileToBase64 } from '../services/fileHandler.js';
import {
    Agent,
    AgentStatus,
    AuthorizationRequest,
    ChatMessage,
    CollaborationStep,
    MissionState,
    LlmStudiosMissionRequest,
    LlmStudiosMissionResponse
} from '../types.js';

// --- HELPERS ---
const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
};

export const useMissionManager = () => {
    const [allAgents, setAllAgents] = useState<Agent[]>([]);
    const [team, setTeam] = useState<Agent[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState<string>('');
    const [missionState, setMissionState] = useState<MissionState>('idle');
    const [missionLog, setMissionLog] = useState<Record<string, AgentStatus>>({});
    const [authorizationRequest, setAuthorizationRequest] = useState<AuthorizationRequest | null>(null);
    const [attachedImage, setAttachedImage] = useState<File | null>(null);

    // Refs to hold mission-scoped data
    const missionIdRef = useRef<string>('');
    const missionTeamRef = useRef<Agent[]>([]);
    const missionResultsRef = useRef<Record<string, string>>({});

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch('./agents.json');
                const agentData: Agent[] = await response.json();
                setAllAgents(agentData);
            } catch (error) {
                console.error("Failed to load agents:", error);
                addMessage('error', 'Failed to load agent roster. Please check the console.');
            }
        };
        fetchAgents();
        addMessage('system', "AgentricAI Core OS Initialized. Assemble your team and define your mission objective.");

    }, []);

    const addMessage = (type: ChatMessage['type'], content: string, sender?: string, options?: { plan?: CollaborationStep[], imageUrl?: string, isSpeakable?: boolean }) => {
        setMessages(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, type, content, sender, plan: options?.plan, imageUrl: options?.imageUrl, isSpeakable: options?.isSpeakable }]);
    };

    const processMissionLoop = async (request: LlmStudiosMissionRequest) => {
        const response = await llmStudiosService.runMissionStep(request);

        // Process log messages or agent outputs from the runtime
        if (response.message) {
            const messageType = response.status === 'EXECUTING' ? 'agent-log' : 'system';
            addMessage(messageType, response.message, response.agentName);
        }
        if (response.agentName) {
            setMissionLog(prev => ({ ...prev, [response.agentName!]: 'thinking' }));
        }

        switch (response.status) {
            case 'PLANNING':
                setMissionState('planning');
                if (response.plan) {
                    addMessage('system', "Mission plan received. Commencing execution...", undefined, { plan: response.plan });
                    const newMissionLog: Record<string, AgentStatus> = {};
                    missionTeamRef.current.forEach(agent => { newMissionLog[agent.name] = 'pending'; });
                    setMissionLog(newMissionLog);
                }
                // Continue the loop
                processMissionLoop(request);
                break;

            case 'EXECUTING':
                setMissionState('executing');
                if (response.agentName && response.message) {
                     // The previous agent is done, save its output
                    const lastAgent = Object.keys(missionLog).find(k => missionLog[k] === 'thinking');
                    if(lastAgent) {
                        missionResultsRef.current[lastAgent] = response.message;
                        setMissionLog(prev => ({ ...prev, [lastAgent]: 'done' }));
                    }
                }
                 // Continue the loop
                processMissionLoop({ ...request, executionResults: missionResultsRef.current });
                break;

            case 'AUTHORIZATION_REQUIRED':
                setMissionState('authorizing');
                const authDetails = response.authorizationRequest;
                if (authDetails) {
                    const agent = missionTeamRef.current.find(a => a.name === authDetails.agentName);
                    if (agent) {
                        setMissionLog(prev => ({...prev, [agent.name]: 'authorizing'}));
                        setAuthorizationRequest({
                            agent,
                            task: authDetails.task,
                            onAllow: () => {
                                setAuthorizationRequest(null);
                                processMissionLoop({ ...request, authorizationGranted: authDetails });
                            },
                            onDeny: () => {
                                setAuthorizationRequest(null);
                                processMissionLoop({ ...request, authorizationGranted: { ...authDetails, agentName: 'DENIED' } });
                            }
                        });
                    }
                }
                break;

            case 'FINISHED':
                setMissionState('finished');
                if (response.finalOutput) {
                    addMessage('final-response', response.finalOutput, response.agentName, { isSpeakable: response.isSpeakable, imageUrl: response.imageUrl });
                } else {
                     addMessage('system', "Mission complete.");
                }
                setMissionLog(prev => {
                    const finalLog = {...prev};
                    Object.keys(finalLog).forEach(k => { finalLog[k] = 'done' });
                    return finalLog;
                });
                break;

            case 'ERROR':
                setMissionState('error');
                addMessage('error', response.error || 'An unknown error occurred in the LLM Studios Runtime.');
                break;
        }
    };

    const handleSend = async (prompt: string, imageFile?: File | null) => {
        if ((!prompt.trim() && !imageFile) || missionState !== 'idle') return;
        
        const currentTeam = team;
        
        setInput('');
        setAttachedImage(null);
        addMessage('user', prompt, undefined, { imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined });
        
        if (currentTeam.length === 0) {
            addMessage('error', 'No agents have been added to the team. Please assemble a team from the Agent Roster.');
            return;
        }

        // --- Start Mission ---
        missionIdRef.current = `mission-${Date.now()}`;
        missionTeamRef.current = currentTeam;
        missionResultsRef.current = {};
        
        let imageInputBase64: string | null = null;
        if (imageFile) {
            imageInputBase64 = await fileToBase64(imageFile);
        }

        const initialRequest: LlmStudiosMissionRequest = {
            missionId: missionIdRef.current,
            objective: prompt,
            team: currentTeam,
            chatHistory: messages,
            executionResults: {},
            imageInputBase64,
        };
        
        processMissionLoop(initialRequest);
    };

    const handleToggleTeam = (agent: Agent) => {
        setTeam(prevTeam => prevTeam.some(a => a.id === agent.id)
            ? prevTeam.filter(a => a.id !== agent.id)
            : [...prevTeam, agent]
        );
    };
    
    const handleSelectAll = () => {
        setTeam(prevTeam => prevTeam.length === allAgents.length ? [] : [...allAgents]);
    };
    
    return {
        allAgents, team, messages, input, setInput, missionState, missionLog,
        authorizationRequest, attachedImage, setAttachedImage,
        handleToggleTeam, handleSelectAll, handleSend
    };
};