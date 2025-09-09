/**
 * @file Coms.ts
 * Communication layer for the SDXL Agent.
 * This file standardizes how the agent formats output and parses input,
 * ensuring consistent data exchange within the AgentricAI framework.
 * Handles image generation requests, model loading status, and error reporting.
 */

import { ImageGenerationRequest, ImageGenerationResponse, ModelStatus, SDXLError } from './Data';

/**
 * Formats an output payload into a standardized message string.
 * This wraps the agent's data with sender identification and a timestamp.
 * @param data The payload to be sent by the agent.
 * @returns A JSON string representing the complete message.
 */
export function formatOutput(data: any): string {
  return JSON.stringify({
    sender: 'SDXL_Agent_Final',
    timestamp: new Date().toISOString(),
    payload: data,
    agentID: 'agent-sdxl'
  }, null, 2);
}

/**
 * Parses an incoming message string for image generation requests.
 * It attempts to parse the message as JSON. If parsing fails,
 * it safely wraps the raw message in a generation request object.
 * @param message The raw incoming message string.
 * @returns A parsed object, or a fallback generation request object.
 */
export function parseInput(message: string): ImageGenerationRequest | any {
  try {
    const parsed = JSON.parse(message);
    
    // Validate if this is an image generation request
    if (parsed.action === 'generate' || parsed.prompt) {
      return validateGenerationRequest(parsed);
    }
    
    return parsed;
  } catch (error) {
    // Gracefully handle non-JSON input by treating it as a direct prompt
    return createGenerationRequest(message);
  }
}

/**
 * Creates a standardized image generation request from a text prompt.
 * @param prompt The text prompt for image generation.
 * @param options Optional generation parameters.
 * @returns A complete ImageGenerationRequest object.
 */
export function createGenerationRequest(
  prompt: string, 
  options?: Partial<ImageGenerationRequest>
): ImageGenerationRequest {
  return {
    action: 'generate',
    prompt: prompt,
    negativePrompt: options?.negativePrompt || '',
    width: options?.width || 1024,
    height: options?.height || 1024,
    steps: options?.steps || 20,
    guidance: options?.guidance || 7.5,
    seed: options?.seed || -1,
    model: options?.model || 'auto',
    outputFormat: options?.outputFormat || 'png',
    requestId: options?.requestId || generateRequestId(),
    priority: options?.priority || 'medium'
  };
}

/**
 * Validates and normalizes an image generation request.
 * @param request The incoming request object.
 * @returns A validated ImageGenerationRequest.
 */
export function validateGenerationRequest(request: any): ImageGenerationRequest {
  const validated: ImageGenerationRequest = {
    action: 'generate',
    prompt: request.prompt || 'A beautiful landscape',
    negativePrompt: request.negativePrompt || '',
    width: Math.min(Math.max(request.width || 1024, 256), 2048),
    height: Math.min(Math.max(request.height || 1024, 256), 2048),
    steps: Math.min(Math.max(request.steps || 20, 1), 100),
    guidance: Math.min(Math.max(request.guidance || 7.5, 1), 20),
    seed: request.seed || -1,
    model: request.model || 'auto',
    outputFormat: ['png', 'jpg', 'jpeg', 'webp'].includes(request.outputFormat) 
      ? request.outputFormat : 'png',
    requestId: request.requestId || generateRequestId(),
    priority: ['high', 'medium', 'low'].includes(request.priority) 
      ? request.priority : 'medium'
  };
  
  return validated;
}

/**
 * Formats a successful image generation response.
 * @param imagePath The path to the generated image.
 * @param request The original request.
 * @param generationTime The time taken to generate the image.
 * @returns A formatted response object.
 */
export function formatGenerationSuccess(
  imagePath: string, 
  request: ImageGenerationRequest,
  generationTime: number
): ImageGenerationResponse {
  return {
    success: true,
    requestId: request.requestId,
    imagePath: imagePath,
    generationTime: generationTime,
    timestamp: new Date().toISOString(),
    metadata: {
      prompt: request.prompt,
      width: request.width,
      height: request.height,
      steps: request.steps,
      guidance: request.guidance,
      seed: request.seed,
      model: request.model
    }
  };
}

/**
 * Formats an error response for failed image generation.
 * @param error The error that occurred.
 * @param request The original request.
 * @returns A formatted error response object.
 */
export function formatGenerationError(
  error: SDXLError, 
  request?: ImageGenerationRequest
): ImageGenerationResponse {
  return {
    success: false,
    requestId: request?.requestId || 'unknown',
    error: {
      code: error.code,
      message: error.message,
      details: error.details
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Formats a model status update message.
 * @param status The current model status.
 * @returns A formatted status message.
 */
export function formatModelStatus(status: ModelStatus): string {
  return formatOutput({
    action: 'modelStatus',
    status: status
  });
}

/**
 * Generates a unique request ID for tracking purposes.
 * @returns A unique request identifier.
 */
function generateRequestId(): string {
  return `sdxl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formats a progress update message for long-running operations.
 * @param requestId The request being processed.
 * @param progress Progress percentage (0-100).
 * @param step Current processing step.
 * @returns A formatted progress message.
 */
export function formatProgressUpdate(
  requestId: string, 
  progress: number, 
  step: string
): string {
  return formatOutput({
    action: 'progress',
    requestId: requestId,
    progress: Math.min(Math.max(progress, 0), 100),
    step: step,
    timestamp: new Date().toISOString()
  });
}
