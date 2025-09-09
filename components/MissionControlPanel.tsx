
import React, { useEffect, useRef } from 'react';
import Panel from './Panel.tsx';
import { ChatMessage, MissionState } from '../types.ts';

// --- HELPERS ---
const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        // A simple trick to remove markdown for cleaner speech
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        utterance.text = tempDiv.textContent || tempDiv.innerText || '';
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Text-to-speech is not supported in your browser.');
    }
};

const downloadText = (content: string, filename: string) => {
    const element = document.createElement("a");
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    const file = new Blob([plainText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

const MissionControlPanel: React.FC<{
    messages: ChatMessage[];
    input: string;
    setInput: (value: string) => void;
    onSend: (prompt: string, imageFile?: File | null) => void;
    missionState: MissionState;
    attachedImage: File | null;
    setAttachedImage: (file: File | null) => void;
    isOnCooldown: boolean;
    isOfflineMode: boolean;
}> = ({ messages, input, setInput, onSend, missionState, attachedImage, setAttachedImage, isOnCooldown, isOfflineMode }) => {
    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const placeholderText: Record<MissionState, string> = {
        idle: "Enter objective...",
        planning: "Planning mission...",
        executing: "Mission in progress...",
        authorizing: "Awaiting authorization...",
        finished: "Mission finished! Ready for new objective.",
        error: "Mission failed. Ready for new objective.",
    };
    
    const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachedImage(e.target.files[0]);
        }
    };

    const isInputDisabled = missionState !== 'idle' || isOnCooldown;
    const finalPlaceholder = isOnCooldown ? "Cooldown active... Please wait." : placeholderText[missionState];

    return (
        <Panel>
            <div className="p-4 border-b border-zinc-700 flex justify-between items-center">
                <div>
                    <h2 className="font-grotesk text-2xl text-zinc-100">Mission Control</h2>
                    <p className="text-zinc-400 text-sm">Define objectives and monitor progress.</p>
                </div>
                <div className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                    missionState === 'executing' || missionState === 'planning' ? 'bg-amber-400 animate-pulse-amber' :
                    missionState === 'authorizing' ? 'bg-cyan-400 animate-pulse-cyan' :
                    missionState === 'finished' ? 'bg-green-500' :
                    missionState === 'error' ? 'bg-red-500' : 'bg-zinc-600'
                }`}></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                     <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`relative max-w-xl p-3 rounded-lg ${
                            msg.type === 'user' ? 'bg-indigo-600 text-white' :
                            msg.type === 'system' ? 'bg-zinc-800 text-zinc-300 w-full' :
                            msg.type === 'error' ? 'bg-red-800/70 text-red-200 w-full' :
                            'bg-zinc-700/80 text-zinc-200'
                        }`}>
                            {msg.sender && <div className="font-bold text-sm text-indigo-300 mb-1">{msg.sender}</div>}
                            <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: msg.content }} />
                             {msg.imageUrl && <img src={msg.imageUrl} alt="Content" className="mt-2 rounded-lg max-w-full h-auto" />}
                             {msg.isSpeakable && (
                                <button onClick={() => speakText(msg.content)} className="absolute top-2 right-2 text-zinc-400 hover:text-white transition-colors" aria-label="Read aloud">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                                </button>
                             )}
                             {msg.type === 'final-response' && !msg.imageUrl && (
                                <button onClick={() => downloadText(msg.content, `agent-output-${msg.id}.txt`)} className="absolute bottom-2 right-2 text-zinc-400 hover:text-white transition-colors" aria-label="Download text">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                </button>
                             )}
                             {msg.plan && (
                                <div className="mt-2 border-t border-zinc-600 pt-2">
                                    <h4 className="font-bold mb-1 text-indigo-300">Mission Plan:</h4>
                                    <ul className="list-decimal list-inside space-y-1">
                                        {msg.plan.map((step, index) => (
                                            <li key={index}>
                                                <strong>{step.agentName}:</strong> {step.task}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-zinc-700">
                {attachedImage && (
                    <div className="mb-2 flex items-center gap-2 bg-zinc-800 p-2 rounded-md">
                        <img src={URL.createObjectURL(attachedImage)} alt="Attachment preview" className="w-12 h-12 rounded-md object-cover"/>
                        <span className="text-zinc-300 text-sm truncate">{attachedImage.name}</span>
                        <button onClick={() => setAttachedImage(null)} className="ml-auto text-zinc-400 hover:text-white">&times;</button>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageAttach} className="hidden" />
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={isInputDisabled || isOfflineMode} 
                        className="p-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 disabled:bg-zinc-800 disabled:cursor-not-allowed transition-colors" 
                        aria-label="Attach image"
                        title={isOfflineMode ? "Image analysis requires the online Gemini API and is disabled" : "Attach image"}
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isInputDisabled && (input.trim() || attachedImage) && onSend(input, attachedImage)}
                        placeholder={finalPlaceholder}
                        className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:cursor-not-allowed disabled:bg-zinc-800/50"
                        disabled={isInputDisabled}
                    />
                    <button
                        onClick={() => (input.trim() || attachedImage) && onSend(input, attachedImage)}
                        disabled={isInputDisabled || (!input.trim() && !attachedImage)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </Panel>
    );
};

export default MissionControlPanel;
