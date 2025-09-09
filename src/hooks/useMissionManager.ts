
import { useState, useEffect, useRef } from 'react';
import { geminiService, QuotaExceededError } from '../services/geminiService.ts';
import { backendService } from '../services/backendService.ts';
import * as fileHandler from '../utils/fileHandler.ts';
import { consciousnessService } from '../services/consciousness.ts';
import { agentLogicService } from '../services/agentLogic.ts';
import { nativeTinyAIService } from '../services/nativeTinyAIService.ts';
import {
    Agent,
    AgentStatus,
    AuthorizationRequest,
    ChatMessage,
    CollaborationStep,
    MissionState,
    Settings,
} from '../types/index.ts';

const parsePlanFromLLM = (responseText: string | null): CollaborationStep[] => {
    if (!responseText) {
        throw new Error("The AI planner returned an empty response. Please try again.");
    }
    try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("The AI planner's response was not structured correctly (invalid JSON). Please try rephrasing your objective.");
        }
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.plan && Array.isArray(parsed.plan)) {
            return parsed.plan;
        } else if (parsed.isSimple && parsed.agentName && parsed.task) {
            return [{ agentName: parsed.agentName, task: parsed.task }];
        }
        throw new Error("The AI planner's response was missing a valid 'plan' or simple task structure. Please try again.");
    } catch (e) {
        console.error("Failed to parse plan from LLM:", responseText, e);
        throw new Error(`The model returned an invalid plan. Details: ${(e as Error).message}`);
    }
}

export const useMissionManager = () => {
    const [allAgents, setAllAgents] = useState<Agent[]>([]);
    const [team, setTeam] = useState<Agent[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState<string>('');
    const [missionState, setMissionState] = useState<MissionState>('idle');
    const [missionLog, setMissionLog] = useState<Record<string, AgentStatus>>({});
    const [authorizationRequest, setAuthorizationRequest] = useState<AuthorizationRequest | null>(null);
    const [attachedImage, setAttachedImage] = useState<File | null>(null);
    const [isOnCooldown, setIsOnCooldown] = useState<boolean>(false);
    const cooldownTimerRef = useRef<number | null>(null);
    const missionIdRef = useRef<string>('');
    const [isAppReady, setIsAppReady] = useState<boolean>(false);
    
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        ollama: null,
        sdModel: null,
        consciousnessCounts: { collective: 0, simulated: 0, theoretical: 0 }
    });

    const isOfflineMode = settings.ollama?.status === 'configured';
    const isOfflineImageMode = settings.sdModel?.status === 'loaded';

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch('./agents.json');
                 if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const agentData: Agent[] = await response.json();
                setAllAgents(agentData.map(a => ({ ...a, status: 'idle' })));
                addMessage('system', "AgentricAI Core OS Initialized. Assemble your team and define your mission objective.");
            } catch (error) {
                console.error("Failed to load agents:", error);
                const errorMessage = `Critical Error: Failed to load agent roster from 'agents.json'. The application cannot function without it. Please check the file's existence and format. Details: ${ (error as Error).message }`;
                addMessage('error', errorMessage);
            } finally {
                setIsAppReady(true);
            }
        };

        fetchAgents();
        updateConsciousnessCounts();
    }, []);

    useEffect(() => {
        return () => {
            if (cooldownTimerRef.current) {
                clearTimeout(cooldownTimerRef.current);
            }
        };
    }, []);
    
    const addMessage = (type: ChatMessage['type'], content: string, sender?: string, options?: { plan?: CollaborationStep[], imageUrl?: string, isSpeakable?: boolean }) => {
        const messageContent = (type === 'agent-output' || type === 'final-response')
            ? window.DOMPurify.sanitize(window.marked.parse(content))
            : content;

        setMessages(prev => [...prev, {
            id: `msg-${Date.now()}-${Math.random()}`,
            missionId: missionIdRef.current,
            type,
            content: messageContent,
            sender,
            ...options
        }]);
    };
    
    const updateConsciousnessCounts = () => {
        setSettings(prev => ({...prev, consciousnessCounts: consciousnessService.getStoreCounts()}));
    };

    const startCooldown = () => {
        setIsOnCooldown(true);
        cooldownTimerRef.current = window.setTimeout(() => {
            setIsOnCooldown(false);
            cooldownTimerRef.current = null;
        }, 2000);
    };

    const executeMission = async (objective: string, currentTeam: Agent[], imageFile: File | null) => {
        setMissionState('planning');
        missionIdRef.current = `mission-${Date.now()}`;
        const initialMissionLog: Record<string, AgentStatus> = {};
        currentTeam.forEach(agent => { initialMissionLog[agent.name] = 'pending'; });
        setMissionLog(initialMissionLog);
        
        consciousnessService.logCollectiveEvent(missionIdRef.current, 'user-input', 'Operator', objective);

        let plan: CollaborationStep[];
        try {
            const nativePlan = await nativeTinyAIService.generatePlan(objective, currentTeam);

            if (nativePlan) {
                addMessage('system', "Objective appears simple. Using native planner...");
                plan = nativePlan;
            } else {
                if (isOfflineMode) {
                    addMessage('system', "Objective is complex. Routing to local Ollama server for planning...");
                    const prompt = geminiService.createPlanPrompt(objective, currentTeam);
                    const response = await backendService.execute('local-llm', { task: prompt, input: '' });
                    if (response.stderr) throw new Error(response.stderr);
                    const planText = response.stdout;
                    plan = parsePlanFromLLM(planText);
                } else {
                    addMessage('system', "Objective is complex. Routing to Gemini API for planning...");
                    const planText = await geminiService.generatePlan(objective, currentTeam);
                    plan = parsePlanFromLLM(planText);
                }
            }
            
            consciousnessService.logTheoreticalConcept(missionIdRef.current, 'Planner', 'plan', objective, plan);
            updateConsciousnessCounts();
            addMessage('system', "Mission plan generated. Commencing execution...", "Orchestrator Alpha", { plan });

        } catch (error) {
            const err = error as Error;
            addMessage('error', `Planning Failed: ${err.message}`);
            setMissionState('error');
            return;
        }

        setMissionState('executing');
        let missionContext = `Initial Objective: ${objective}`;
        
        for (const step of plan) {
            const agent = allAgents.find(a => a.name === step.agentName);
            if (!agent) {
                addMessage('error', `Execution Failed: Agent "${step.agentName}" not found in roster.`);
                setMissionState('error');
                return;
            }

            setMissionLog(prev => ({ ...prev, [agent.name]: 'thinking' }));

            try {
                let result = '';
                
                if (agent.tool === 'imageGeneration') {
                    if (isOfflineImageMode) {
                        addMessage('system', 'Using local model for image generation...', agent.name);
                        const { stdout, stderr } = await backendService.execute('imageGeneration', { task: step.task, input: missionContext });
                        if (stderr) throw new Error(stderr);
                        result = stdout ? `data:image/svg+xml;base64,${stdout}` : '';
                    } else {
                        addMessage('system', 'Using Gemini API for image generation...', agent.name);
                        result = await geminiService.generateImage(step.task);
                    }
                } else if (agent.tool === 'fileSystem') {
                    result = await (step.task.toLowerCase().includes('directory') 
                        ? fileHandler.requestDirectory().then(c => c.join('\n\n'))
                        : fileHandler.requestFiles().then(async files => 
                            Promise.all(files.map(async f => `File: ${f.name}\nContent:\n${await f.text()}`)).then(c => c.join('\n\n'))
                        ));
                } else if (agent.tool) { // python, git, system
                    const authPromise = new Promise<string>((resolve, reject) => {
                        setMissionLog(prev => ({...prev, [agent.name]: 'authorizing'}));
                        setAuthorizationRequest({
                            agent,
                            task: step.task,
                            onAllow: async () => {
                                setAuthorizationRequest(null);
                                try {
                                    const { stdout, stderr } = await backendService.execute(agent.tool!, { task: step.task, input: missionContext });
                                    if (stderr) reject(new Error(stderr));
                                    else resolve(stdout || "Command executed successfully.");
                                } catch (e) { reject(e); }
                            },
                            onDeny: () => {
                                setAuthorizationRequest(null);
                                reject(new Error("Operator denied execution."));
                            }
                        });
                    });
                    result = await authPromise;
                } else if (agent.logic === 'local') {
                    result = await agentLogicService.execute(agent.name, step.task, missionContext);
                } else { // LLM-based logic (Gemini or local)
                    if (isOfflineMode) {
                        const prompt = geminiService.createAgentPrompt(agent, step.task, missionContext);
                        const { stdout, stderr } = await backendService.execute('local-llm', { task: prompt, input: '' });
                        if (stderr) throw new Error(stderr);
                        result = stdout || "Local model returned no response.";
                    } else { // Online Gemini API
                        if (agent.name.includes('Image Analyzer') && imageFile) {
                             const base64 = await fileHandler.fileToBase64(imageFile);
                             result = await geminiService.analyzeImage(step.task, { base64, mimeType: imageFile.type });
                        } else {
                            result = await geminiService.runAgentTask(agent, step.task, missionContext);
                        }
                    }
                }
                
                consciousnessService.logSimulatedData(missionIdRef.current, agent.name, 'text', step.task, result);
                updateConsciousnessCounts();
                missionContext += `\n\n--- Output from ${agent.name} ---\n${result}`;
                setMissionLog(prev => ({ ...prev, [agent.name]: 'done' }));

                const isImage = result.startsWith('data:image');
                addMessage('agent-output', isImage ? '' : result, agent.name, { imageUrl: isImage ? result : undefined });
                
            } catch (error) {
                const err = error as Error;
                addMessage('error', `Agent ${agent.name} failed: ${err.message}`, agent.name);
                setMissionLog(prev => ({ ...prev, [agent.name]: 'error' }));
                setMissionState('error');
                return;
            }
        }
        
        addMessage('final-response', `**Mission Debrief:** All tasks completed. The final context is as follows:\n\n---\n${missionContext}`, "System", { isSpeakable: true });
        setMissionState('finished');
    };

    const handleSend = async (prompt: string, imageFile?: File | null) => {
        if ((!prompt.trim() && !imageFile) || (missionState !== 'idle' && missionState !== 'finished' && missionState !== 'error')) return;
        
        startCooldown();
        setInput('');
        setAttachedImage(null);
        addMessage('user', prompt, "Operator", { imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined });
        
        if (team.length === 0) {
            addMessage('error', 'No agents have been added to the team. Please assemble a team from the Agent Roster.');
            setMissionState('idle');
            return;
        }

        executeMission(prompt, team, imageFile);
    };

    const handleToggleTeam = (agent: Agent) => {
        setTeam(prevTeam => prevTeam.some(a => a.id === agent.id)
            ? prevTeam.filter(a => a.id !== agent.id)
            : [...prevTeam, agent]
        );
    };

    const handleSelectAll = () => {
        setTeam(prevTeam => {
            const selectableAgents = allAgents.filter(agent => {
                const isImageAgent = agent.tool === 'imageGeneration';
                const isImageDisabled = isImageAgent && !isOfflineImageMode;
                return !isImageDisabled;
            });
             if (prevTeam.length === selectableAgents.length) return [];
             return selectableAgents;
        });
    };
    
    const handleClearMemory = () => {
        consciousnessService.clearAllMemory();
        updateConsciousnessCounts();
        addMessage('system', "All consciousness logs have been cleared from local storage.");
    };

    const handleOpenSettings = () => setIsSettingsOpen(true);
    const handleCloseSettings = () => setIsSettingsOpen(false);

    const handleUpdateOllamaSettings = async (endpoint: string, model: string) => {
        if (!window.electronAPI) return;
        const { success } = await window.electronAPI.updateOllamaSettings({ endpoint, model });
        if (success) {
            setSettings(s => ({ ...s, ollama: { endpoint, model, status: 'configured' } }));
            addMessage('system', `Ollama settings updated. Now using model '${model}' at endpoint '${endpoint}'. **Online-only agents are now operational using this local model for text tasks.**`);
        } else {
            const error = `Failed to save Ollama settings in the main process.`;
            setSettings(s => ({ ...s, ollama: { endpoint, model, status: 'error', error } }));
            addMessage('error', error);
        }
    };
    
    const handleDisconnectOllama = () => {
        setSettings(s => ({ ...s, ollama: null }));
        addMessage('system', 'Disconnected from Ollama. Reverting to online Gemini API for text tasks.');
    };
    
    const handleLoadSdModel = async () => {
         if (!window.electronAPI) return;
        setSettings(s => ({ ...s, sdModel: { path: '', status: 'loading' } }));
        const result = await window.electronAPI.openSafetensorsDialog();
        if (result.success) {
            setSettings(s => ({ ...s, sdModel: { path: result.path!, status: 'loaded' } }));
            addMessage('system', `Local Safetensors model loaded: ${result.path}. Offline image generation is now active.`);
        } else {
            setSettings(s => ({ ...s, sdModel: { path: '', status: 'error', error: result.error } }));
            addMessage('error', `Failed to load Safetensors model: ${result.error}`);
        }
    };
    
    const handleUnloadSdModel = async () => {
        if (!window.electronAPI) return;
        await window.electronAPI.unloadSdModel();
        setSettings(s => ({ ...s, sdModel: null }));
        addMessage('system', 'Local Safetensors model unloaded. Reverting to online Gemini API for image generation.');
    };

    return {
        isAppReady,
        allAgents,
        team,
        messages,
        input,
        setInput,
        missionState,
        missionLog,
        authorizationRequest,
        attachedImage,
        setAttachedImage,
        isOnCooldown,
        isSettingsOpen,
        settings,
        isOfflineMode,
        isOfflineImageMode,
        handleToggleTeam,
        handleSelectAll,
        handleSend,
        handleClearMemory,
        handleOpenSettings,
        handleCloseSettings,
        handleUpdateOllamaSettings,
        handleDisconnectOllama,
        handleLoadSdModel,
        handleUnloadSdModel,
    };
};
