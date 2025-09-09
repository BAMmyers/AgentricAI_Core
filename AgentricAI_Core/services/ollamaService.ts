/**
 * @file ollamaService.ts
 * Service for interacting with local Ollama LLM models.
 * Provides a unified interface for text generation, chat completion,
 * and model management using the local AgentricAI_TLM model.
 */

import { spawn, ChildProcess } from 'child_process';
import { promisify } from 'util';

// Interfaces for Ollama integration
export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: OllamaOptions;
}

export interface OllamaOptions {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
  stop?: string[];
  seed?: number;
}

export interface OllamaResponse {
  success: boolean;
  response?: string;
  error?: string;
  model?: string;
  done?: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream?: boolean;
  options?: OllamaOptions;
}

export interface OllamaModelInfo {
  name: string;
  size: number;
  digest: string;
  details?: {
    family: string;
    format: string;
    parameter_size: string;
    quantization_level: string;
  };
  modified_at: string;
}

export interface OllamaServiceConfig {
  modelName: string;
  ollamaEndpoint: string;
  timeout: number;
  retryAttempts: number;
  defaultOptions: OllamaOptions;
}

class OllamaService {
  private config: OllamaServiceConfig;
  private isConnected: boolean = false;
  private modelLoaded: boolean = false;

  constructor(config?: Partial<OllamaServiceConfig>) {
    this.config = {
      modelName: 'AgentricAI_TLM',
      ollamaEndpoint: 'http://localhost:11434',
      timeout: 30000,
      retryAttempts: 3,
      defaultOptions: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2048
      },
      ...config
    };
  }

  /**
   * Checks if Ollama service is running and accessible
   * @returns Promise<boolean> True if Ollama is available
   */
  async checkOllamaAvailability(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/api/version', 'GET');
      this.isConnected = response.ok;
      return this.isConnected;
    } catch (error) {
      console.warn('Ollama service not available:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Lists all available models in Ollama
   * @returns Promise<OllamaModelInfo[]> Array of available models
   */
  async listModels(): Promise<OllamaModelInfo[]> {
    try {
      const response = await this.makeRequest('/api/tags', 'GET');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.models || [];
      
    } catch (error) {
      console.error('Failed to list Ollama models:', error);
      throw new Error(`Failed to list models: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Checks if the AgentricAI_TLM model is available and loads it if necessary
   * @returns Promise<boolean> True if model is loaded and ready
   */
  async ensureModelLoaded(): Promise<boolean> {
    try {
      const models = await this.listModels();
      const targetModel = models.find(model => 
        model.name === this.config.modelName || 
        model.name.includes('AgentricAI_TLM')
      );

      if (!targetModel) {
        console.warn(`Model ${this.config.modelName} not found in available models`);
        return false;
      }

      // Test the model with a simple prompt
      const testResponse = await this.generateText('Hello', { max_tokens: 10 });
      this.modelLoaded = testResponse.success;
      
      return this.modelLoaded;
      
    } catch (error) {
      console.error('Failed to ensure model is loaded:', error);
      this.modelLoaded = false;
      return false;
    }
  }

  /**
   * Generates text using the Ollama model
   * @param prompt The input prompt
   * @param options Optional generation parameters
   * @returns Promise<OllamaResponse> The generated response
   */
  async generateText(prompt: string, options?: OllamaOptions): Promise<OllamaResponse> {
    try {
      if (!await this.checkOllamaAvailability()) {
        return {
          success: false,
          error: 'Ollama service is not available. Please ensure Ollama is running.'
        };
      }

      const requestBody: OllamaRequest = {
        model: this.config.modelName,
        prompt: prompt,
        stream: false,
        options: {
          ...this.config.defaultOptions,
          ...options
        }
      };

      const response = await this.makeRequest('/api/generate', 'POST', requestBody);
      
      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText || response.statusText}`
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        response: data.response,
        model: data.model,
        done: data.done,
        total_duration: data.total_duration,
        load_duration: data.load_duration,
        prompt_eval_count: data.prompt_eval_count,
        eval_count: data.eval_count,
        eval_duration: data.eval_duration
      };
      
    } catch (error) {
      return {
        success: false,
        error: `Text generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Performs a chat completion using conversation history
   * @param messages Array of chat messages
   * @param options Optional generation parameters
   * @returns Promise<OllamaResponse> The chat response
   */
  async chatCompletion(messages: OllamaChatMessage[], options?: OllamaOptions): Promise<OllamaResponse> {
    try {
      if (!await this.checkOllamaAvailability()) {
        return {
          success: false,
          error: 'Ollama service is not available. Please ensure Ollama is running.'
        };
      }

      const requestBody: OllamaChatRequest = {
        model: this.config.modelName,
        messages: messages,
        stream: false,
        options: {
          ...this.config.defaultOptions,
          ...options
        }
      };

      const response = await this.makeRequest('/api/chat', 'POST', requestBody);
      
      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText || response.statusText}`
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        response: data.message?.content || data.response,
        model: data.model,
        done: data.done,
        total_duration: data.total_duration,
        load_duration: data.load_duration,
        prompt_eval_count: data.prompt_eval_count,
        eval_count: data.eval_count,
        eval_duration: data.eval_duration
      };
      
    } catch (error) {
      return {
        success: false,
        error: `Chat completion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Enhances image generation prompts using the local LLM
   * @param basicPrompt The basic prompt to enhance
   * @returns Promise<string> Enhanced prompt
   */
  async enhanceImagePrompt(basicPrompt: string): Promise<string> {
    try {
      const enhancementPrompt = `As an AI prompt enhancement expert, improve this image generation prompt to be more detailed and descriptive while maintaining the original intent. Make it suitable for Stable Diffusion XL:

Original prompt: "${basicPrompt}"

Enhanced prompt:`;

      const response = await this.generateText(enhancementPrompt, {
        temperature: 0.8,
        max_tokens: 200
      });

      if (response.success && response.response) {
        // Clean up the response to extract just the enhanced prompt
        const enhanced = response.response
          .replace(/^Enhanced prompt:\s*/i, '')
          .replace(/^["']|["']$/g, '')
          .trim();
        
        return enhanced || basicPrompt;
      }

      return basicPrompt;
      
    } catch (error) {
      console.warn('Failed to enhance prompt, using original:', error);
      return basicPrompt;
    }
  }

  /**
   * Gets model status and performance information
   * @returns Promise<{ available: boolean; loaded: boolean; info?: OllamaModelInfo }>
   */
  async getModelStatus(): Promise<{ available: boolean; loaded: boolean; info?: OllamaModelInfo }> {
    try {
      const available = await this.checkOllamaAvailability();
      
      if (!available) {
        return { available: false, loaded: false };
      }

      const models = await this.listModels();
      const modelInfo = models.find(model => 
        model.name === this.config.modelName || 
        model.name.includes('AgentricAI_TLM')
      );

      const loaded = await this.ensureModelLoaded();

      return {
        available: true,
        loaded: loaded,
        info: modelInfo
      };
      
    } catch (error) {
      console.error('Failed to get model status:', error);
      return { available: false, loaded: false };
    }
  }

  /**
   * Performs a health check on the Ollama service and model
   * @returns Promise<{ healthy: boolean; issues: string[] }>
   */
  async healthCheck(): Promise<{ healthy: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      // Check if Ollama service is running
      if (!await this.checkOllamaAvailability()) {
        issues.push('Ollama service is not running or not accessible');
      }

      // Check if model is available
      const models = await this.listModels();
      const hasTargetModel = models.some(model => 
        model.name === this.config.modelName || 
        model.name.includes('AgentricAI_TLM')
      );

      if (!hasTargetModel) {
        issues.push(`Model ${this.config.modelName} is not available in Ollama`);
      }

      // Test basic functionality
      if (issues.length === 0) {
        const testResponse = await this.generateText('Test', { max_tokens: 1 });
        if (!testResponse.success) {
          issues.push('Model failed basic functionality test');
        }
      }

      return {
        healthy: issues.length === 0,
        issues: issues
      };
      
    } catch (error) {
      issues.push(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        healthy: false,
        issues: issues
      };
    }
  }

  /**
   * Makes an HTTP request to the Ollama API
   * @private
   */
  private async makeRequest(endpoint: string, method: 'GET' | 'POST', body?: any): Promise<Response> {
    const url = `${this.config.ollamaEndpoint}${endpoint}`;
    
    const options: RequestInit = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body && method === 'POST') {
      options.body = JSON.stringify(body);
    }

    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Updates the service configuration
   * @param newConfig Partial configuration to update
   */
  updateConfig(newConfig: Partial<OllamaServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.isConnected = false; // Reset connection status
    this.modelLoaded = false; // Reset model status
  }

  /**
   * Gets the current configuration
   * @returns Current service configuration
   */
  getConfig(): OllamaServiceConfig {
    return { ...this.config };
  }
}

// Export a singleton instance
export const ollamaService = new OllamaService();

// Export types for use by other modules
export type { 
  OllamaRequest, 
  OllamaResponse, 
  OllamaChatMessage, 
  OllamaChatRequest, 
  OllamaModelInfo,
  OllamaServiceConfig,
  OllamaOptions
};
