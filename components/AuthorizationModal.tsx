
import React from 'react';
import { AuthorizationRequest } from '../types.ts';

const AuthorizationModal: React.FC<{ request: AuthorizationRequest | null }> = ({ request }) => {
    if (!request) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-cyan-500/50 rounded-lg shadow-2xl p-6 max-w-lg w-full">
                <h2 className="font-grotesk text-2xl text-cyan-300 mb-2">Authorization Required</h2>
                <p className="text-zinc-300 mb-4">Agent <strong className="text-white">{request.agent.name}</strong> requires permission to execute the following task:</p>
                <div className="bg-zinc-800 p-4 rounded-md text-cyan-200 mb-6 font-mono text-sm">
                    {request.task}
                </div>
                <div className="flex justify-end gap-4">
                    <button onClick={request.onDeny} className="px-4 py-2 bg-zinc-700 text-zinc-200 rounded-md hover:bg-zinc-600 transition-colors">Deny</button>
                    <button onClick={request.onAllow} className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition-colors">Allow</button>
                </div>
            </div>
        </div>
    );
};

export default AuthorizationModal;
