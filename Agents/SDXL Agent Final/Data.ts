/**
 * @file Data.ts
 * Data structures and state management for the SDXL Agent.
 * This file defines the data models, types, and state management
 * for SDXL-based image generation using safetensor models.
 */

// Core interfaces for image generation requests and responses
export interface ImageGenerationRequest {
  action: 'generate';
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  guidance?: number;
  seed?: number;
  model?: string;
  outputFormat?: 'png' | 'jpg' | 'jpeg' | 'webp';
  requestId: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface ImageGenerationResponse {
  success: boolean;
  requestId: string;
  imagePath?: string;
  generationTime?: number;
  timestamp: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    prompt: string;
    width: number;
    height: number;
    steps: number;
    guidance: number;
    seed: number;
    model: string;
  };
}

// Model loading and status interfaces
export interface ModelStatus {
  loaded: boolean;
  currentModel?: string;
  loadingProgress?: number;
  availableModels: string[];
  lastError?: SDXLError;
}

// Error handling interface
export interface SDXLError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  recoverable: boolean;
}

// Generation queue and job management
export interface GenerationJob {
  id: string;
  request: ImageGenerationRequest;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startTime?: number;
  endTime?: number;
  progress: number;
  result?: ImageGenerationResponse;
}

// Agent state management
export interface SDXLAgentState {
  isInitialized: boolean;
  modelStatus: ModelStatus;
  activeJobs: Map<string, GenerationJob>;
  completedJobs: GenerationJob[];
  failedJobs: GenerationJob[];
  config: SDXLConfig;
  performance: {
    totalGenerated: number;
    averageTime: number;
    successRate: number;
  };
}

// Configuration for SDXL processing
export interface SDXLConfig {
  modelPath: string;
  maxConcurrentJobs: number;
  defaultWidth: number;
  defaultHeight: number;
  defaultSteps: number;
  defaultGuidance: number;
  outputDirectory: string;
  enableBackgroundProcessing: boolean;
  memoryOptimization: boolean;
  timeout: number;
}

// Safetensor model loading interface
export interface SafetensorModel {
  name: string;
  path: string;
  size: number;
  version: string;
  loaded: boolean;
  loadTime?: number;
  metadata?: {
    description: string;
    author: string;
    tags: string[];
    resolution: string;
  };
}

/**
 * Creates initial state for the SDXL Agent
 * @returns Initial agent state
 */
export function createInitialState(): SDXLAgentState {
  return {
    isInitialized: false,
    modelStatus: {
      loaded: false,
      availableModels: [],
      loadingProgress: 0
    },
    activeJobs: new Map(),
    completedJobs: [],
    failedJobs: [],
    config: {
      modelPath: 'models',
      maxConcurrentJobs: 2,
      defaultWidth: 1024,
      defaultHeight: 1024,
      defaultSteps: 20,
      defaultGuidance: 7.5,
      outputDirectory: 'output/images',
      enableBackgroundProcessing: true,
      memoryOptimization: true,
      timeout: 300000 // 5 minutes
    },
    performance: {
      totalGenerated: 0,
      averageTime: 0,
      successRate: 100
    }
  };
}

/**
 * Creates a new generation job
 * @param request The image generation request
 * @returns A new generation job
 */
export function createGenerationJob(request: ImageGenerationRequest): GenerationJob {
  return {
    id: request.requestId,
    request: request,
    status: 'pending',
    progress: 0
  };
}

/**
 * Updates job progress
 * @param job The job to update
 * @param progress Progress percentage (0-100)
 * @param status Optional status update
 */
export function updateJobProgress(
  job: GenerationJob, 
  progress: number, 
  status?: GenerationJob['status']
): void {
  job.progress = Math.min(Math.max(progress, 0), 100);
  if (status) {
    job.status = status;
  }
  
  if (status === 'processing' && !job.startTime) {
    job.startTime = Date.now();
  }
  
  if ((status === 'completed' || status === 'failed') && !job.endTime) {
    job.endTime = Date.now();
  }
}

/**
 * Creates an SDXL error object
 * @param code Error code
 * @param message Error message
 * @param details Additional error details
 * @param recoverable Whether the error can be recovered from
 * @returns SDXLError object
 */
export function createSDXLError(
  code: string, 
  message: string, 
  details?: any, 
  recoverable: boolean = false
): SDXLError {
  return {
    code,
    message,
    details,
    timestamp: new Date().toISOString(),
    recoverable
  };
}

/**
 * Validates an image generation request
 * @param request The request to validate
 * @returns Validation result with errors if any
 */
export function validateRequest(request: ImageGenerationRequest): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!request.prompt || request.prompt.trim().length === 0) {
    errors.push('Prompt is required and cannot be empty');
  }
  
  if (request.width && (request.width < 256 || request.width > 2048)) {
    errors.push('Width must be between 256 and 2048 pixels');
  }
  
  if (request.height && (request.height < 256 || request.height > 2048)) {
    errors.push('Height must be between 256 and 2048 pixels');
  }
  
  if (request.steps && (request.steps < 1 || request.steps > 100)) {
    errors.push('Steps must be between 1 and 100');
  }
  
  if (request.guidance && (request.guidance < 1 || request.guidance > 20)) {
    errors.push('Guidance scale must be between 1 and 20');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculates performance metrics for the agent
 * @param state Current agent state
 * @returns Updated performance metrics
 */
export function calculatePerformanceMetrics(state: SDXLAgentState): SDXLAgentState['performance'] {
  const completedJobs = state.completedJobs;
  const failedJobs = state.failedJobs;
  const totalJobs = completedJobs.length + failedJobs.length;
  
  if (totalJobs === 0) {
    return {
      totalGenerated: 0,
      averageTime: 0,
      successRate: 100
    };
  }
  
  const totalTime = completedJobs.reduce((sum, job) => {
    if (job.startTime && job.endTime) {
      return sum + (job.endTime - job.startTime);
    }
    return sum;
  }, 0);
  
  const averageTime = completedJobs.length > 0 ? totalTime / completedJobs.length : 0;
  const successRate = (completedJobs.length / totalJobs) * 100;
  
  return {
    totalGenerated: completedJobs.length,
    averageTime: Math.round(averageTime),
    successRate: Math.round(successRate * 100) / 100
  };
}

// Export types for external use
export type {
  ImageGenerationRequest,
  ImageGenerationResponse,
  ModelStatus,
  SDXLError,
  GenerationJob,
  SDXLAgentState,
  SDXLConfig,
  SafetensorModel
};