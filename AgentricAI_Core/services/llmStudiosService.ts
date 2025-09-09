import { LlmStudiosMissionRequest, LlmStudiosMissionResponse } from '../types.js';

// This is a placeholder for the actual LLM Studios endpoint.
// In a real scenario, this would point to the deployed runtime service.
const LLM_STUDIOS_ENDPOINT = 'http://localhost:1138/v1/agentric/mission_execute';

class LlmStudiosService {
    /**
     * Sends the current mission state to LLM Studios for the next computation step.
     * LLM Studios is now responsible for all logic: planning, agent selection, 
     * tool execution, and calls to the underlying LLM.
     * The frontend's role is to send the state and render the response.
     */
    async runMissionStep(request: LlmStudiosMissionRequest): Promise<LlmStudiosMissionResponse> {
        try {
            console.log("Sending request to LLM Studios:", request);
            
            // This is where you would make a real network request.
            // For this example, we will simulate a response as if a local server were running.
            // In a real application, you would remove the simulation and use the fetch call.
            
            const response = await fetch(LLM_STUDIOS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error from LLM Studios.' }));
                const errorMessage = `LLM Studios Error (${response.status}): ${errorBody.error || response.statusText}`;
                console.error(errorMessage);
                return { status: 'ERROR', error: errorMessage };
            }

            return await response.json();

        } catch (error) {
            const errorMessage = "Fatal: Could not connect to the LLM Studios runtime service. Please ensure the service is running and accessible at " + LLM_STUDIOS_ENDPOINT;
            console.error(errorMessage, error);
            // Return a structured error to be displayed in the UI
            return { status: 'ERROR', error: errorMessage };
        }
    }
}

export const llmStudiosService = new LlmStudiosService();
