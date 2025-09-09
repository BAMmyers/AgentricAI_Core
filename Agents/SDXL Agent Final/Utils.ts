/**
 * @file Utils.ts
 * Utility functions for the SDXL Agent.
 * This file contains helper functions for model management,
 * image processing, file operations, and system integration.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { SafetensorModel, SDXLError, createSDXLError } from './Data';

/**
 * Scans a directory for safetensor model files
 * @param modelPath Path to the models directory
 * @returns Array of discovered safetensor models
 */
export async function scanForModels(modelPath: string): Promise<SafetensorModel[]> {
  try {
    await fs.access(modelPath);
    const files = await fs.readdir(modelPath);
    
    const models: SafetensorModel[] = [];
    
    for (const file of files) {
      if (file.endsWith('.safetensors')) {
        const filePath = path.join(modelPath, file);
        try {
          const stats = await fs.stat(filePath);
          
          const model: SafetensorModel = {
            name: path.basename(file, '.safetensors'),
            path: filePath,
            size: stats.size,
            version: 'unknown',
            loaded: false,
            metadata: {
              description: 'Safetensor model for SDXL',
              author: 'Unknown',
              tags: ['sdxl', 'diffusion'],
              resolution: '1024x1024'
            }
          };
          
          models.push(model);
        } catch (error) {
          console.warn(`Failed to read model file stats: ${file}`, error);
        }
      }
    }
    
    return models;
  } catch (error) {
    console.warn(`Failed to scan models directory: ${modelPath}`, error);
    return [];
  }
}

/**
 * Creates the models directory if it doesn't exist
 * @param modelPath Path to create
 */
export async function ensureModelDirectory(modelPath: string): Promise<void> {
  try {
    await fs.access(modelPath);
  } catch {
    await fs.mkdir(modelPath, { recursive: true });
  }
}

/**
 * Creates the output directory if it doesn't exist
 * @param outputPath Path to create
 */
export async function ensureOutputDirectory(outputPath: string): Promise<void> {
  try {
    await fs.access(outputPath);
  } catch {
    await fs.mkdir(outputPath, { recursive: true });
  }
}

/**
 * Generates a unique filename for an image
 * @param prefix Filename prefix
 * @param extension File extension (without dot)
 * @returns Unique filename
 */
export function generateImageFilename(prefix: string = 'sdxl', extension: string = 'png'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}.${extension}`;
}

/**
 * Validates if a file is a valid safetensor model
 * @param filePath Path to the file
 * @returns True if valid safetensor file
 */
export async function validateSafetensorFile(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    
    // Basic validation: file exists, has reasonable size, and correct extension
    if (!stats.isFile()) {
      return false;
    }
    
    if (stats.size < 1024 * 1024) { // Less than 1MB is suspicious for a model
      return false;
    }
    
    if (!filePath.toLowerCase().endsWith('.safetensors')) {
      return false;
    }
    
    // Could add more sophisticated validation here
    // such as reading file headers or metadata
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats file size in human-readable format
 * @param bytes Size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Validates system requirements for SDXL processing
 * @returns Validation result with warnings/errors
 */
export async function validateSystemRequirements(): Promise<{
  valid: boolean;
  warnings: string[];
  errors: string[];
}> {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Check available memory (basic check)
  const totalMemory = process.memoryUsage();
  const freeMemory = totalMemory.heapTotal - totalMemory.heapUsed;
  
  if (freeMemory < 2 * 1024 * 1024 * 1024) { // Less than 2GB
    warnings.push('Low available memory detected. SDXL processing may be slow.');
  }
  
  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);
  
  if (majorVersion < 16) {
    errors.push('Node.js version 16 or higher is required for optimal performance.');
  }
  
  return {
    valid: errors.length === 0,
    warnings,
    errors
  };
}

/**
 * Sanitizes a prompt for safe file naming and processing
 * @param prompt Raw prompt text
 * @returns Sanitized prompt
 */
export function sanitizePrompt(prompt: string): string {
  return prompt
    .replace(/[^a-zA-Z0-9\s\-_.,!?]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim()
    .substring(0, 200); // Limit length
}

/**
 * Creates a metadata object for generated images
 * @param request The generation request
 * @param filePath Path to the generated image
 * @param generationTime Time taken to generate
 * @returns Metadata object
 */
export function createImageMetadata(
  request: any,
  filePath: string,
  generationTime: number
): object {
  return {
    prompt: request.prompt,
    negativePrompt: request.negativePrompt || '',
    width: request.width,
    height: request.height,
    steps: request.steps,
    guidance: request.guidance,
    seed: request.seed,
    model: request.model,
    generationTime: generationTime,
    timestamp: new Date().toISOString(),
    filePath: filePath,
    agent: 'SDXL_Agent_Final',
    version: '1.0'
  };
}

/**
 * Saves metadata alongside generated images
 * @param imagePath Path to the image file
 * @param metadata Metadata to save
 */
export async function saveImageMetadata(
  imagePath: string,
  metadata: object
): Promise<void> {
  const metadataPath = imagePath.replace(/\.[^.]+$/, '.meta.json');
  
  try {
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.warn('Failed to save image metadata:', error);
  }
}

/**
 * Cleans up temporary files and old generations
 * @param outputPath Path to the output directory
 * @param maxAge Maximum age in milliseconds (default 24 hours)
 */
export async function cleanupOldFiles(
  outputPath: string,
  maxAge: number = 24 * 60 * 60 * 1000
): Promise<void> {
  try {
    const files = await fs.readdir(outputPath);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(outputPath, file);
      try {
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          console.log(`Cleaned up old file: ${file}`);
        }
      } catch (error) {
        console.warn(`Failed to cleanup file: ${file}`, error);
      }
    }
  } catch (error) {
    console.warn('Failed to cleanup old files:', error);
  }
}

/**
 * Logs agent activity for debugging and monitoring
 * @param level Log level
 * @param message Log message
 * @param details Additional details
 */
export function logActivity(
  level: 'info' | 'warn' | 'error',
  message: string,
  details?: any
): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [SDXL-Agent] [${level.toUpperCase()}] ${message}`;
  
  switch (level) {
    case 'error':
      console.error(logMessage, details || '');
      break;
    case 'warn':
      console.warn(logMessage, details || '');
      break;
    default:
      console.log(logMessage, details || '');
  }
}

/**
 * Creates a retry wrapper for operations that might fail
 * @param operation Function to retry
 * @param maxRetries Maximum number of retries
 * @param delay Delay between retries in milliseconds
 * @returns Promise that resolves with the operation result
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      logActivity('warn', `Operation failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`, error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.5; // Exponential backoff
    }
  }
  
  throw lastError;
}

/**
 * Converts various image formats to the requested output format
 * @param inputPath Path to the input image
 * @param outputFormat Desired output format
 * @returns Path to the converted image
 */
export async function convertImageFormat(
  inputPath: string,
  outputFormat: string
): Promise<string> {
  // This is a placeholder for image format conversion
  // In a real implementation, you would use a library like sharp or jimp
  const outputPath = inputPath.replace(/\.[^.]+$/, `.${outputFormat}`);
  
  try {
    // For now, just copy the file if the format is the same
    // or log a warning if conversion is needed
    if (inputPath.toLowerCase().endsWith(`.${outputFormat.toLowerCase()}`)) {
      return inputPath;
    }
    
    logActivity('warn', 'Image format conversion not implemented', {
      input: inputPath,
      requestedFormat: outputFormat
    });
    
    return inputPath; // Return original for now
  } catch (error) {
    logActivity('error', 'Failed to convert image format', error);
    return inputPath;
  }
}

// Export utility constants
export const SUPPORTED_FORMATS = ['png', 'jpg', 'jpeg', 'webp'] as const;
export const DEFAULT_MODEL_PATH = 'models';
export const DEFAULT_OUTPUT_PATH = 'output/images';
export const MAX_CONCURRENT_JOBS = 2;
export const DEFAULT_GENERATION_TIMEOUT = 300000; // 5 minutes