
import React from 'react';
import { useMissionManager } from './hooks/useMissionManager.ts';
import AgentRosterPanel from './components/AgentRosterPanel.tsx';
import MissionControlPanel from './components/MissionControlPanel.tsx';
import TeamStatusPanel from './components/TeamStatusPanel.tsx';
import AuthorizationModal from './components/AuthorizationModal.tsx';
import SettingsModal from './components/SettingsModal.tsx';

const App: React.FC = () => {
    const {
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
    } = useMissionManager();

    // Hide the boot screen once the app is ready and has rendered
    React.useEffect(() => {
        if (isAppReady) {
            const bootScreen = document.getElementById('boot-screen');
            if (bootScreen) {
                window.bootManager.stop();
                bootScreen.classList.add('hidden');
            }
        }
    }, [isAppReady]);
    
    // Render nothing until agents are loaded to prevent UI flicker, boot screen handles loading state.
    if (!isAppReady) {
        return null;
    }

    return (
        <>
            <AgentRosterPanel
                agents={allAgents}
                team={team}
                onToggleTeam={handleToggleTeam}
                onSelectAll={handleSelectAll}
                isOfflineMode={isOfflineMode}
                isOfflineImageMode={isOfflineImageMode}
            />
            <MissionControlPanel
                messages={messages}
                input={input}
                setInput={setInput}
                onSend={handleSend}
                missionState={missionState}
                attachedImage={attachedImage}
                setAttachedImage={setAttachedImage}
                isOnCooldown={isOnCooldown}
                isOfflineMode={isOfflineMode}
            />
            <TeamStatusPanel
                team={team}
                missionLog={missionLog}
                onClearMemory={handleClearMemory}
                onOpenSettings={handleOpenSettings}
            />
            <AuthorizationModal request={authorizationRequest} />
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={handleCloseSettings}
                settings={settings}
                onUpdateOllamaSettings={handleUpdateOllamaSettings}
                onDisconnectOllama={handleDisconnectOllama}
                onLoadSdModel={handleLoadSdModel}
                onUnloadSdModel={handleUnloadSdModel}
            />
        </>
    );
};

export default App;