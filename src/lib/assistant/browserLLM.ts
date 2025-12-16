import { pipeline, env } from '@xenova/transformers';
import { tools } from '@/lib/tools';

// Configure Transformers.js to use browser cache
env.useBrowserCache = true;
env.allowLocalModels = false;

// Set custom model path if needed (optional - uses Hugging Face by default)
// env.remoteURL = 'https://huggingface.co';

let generator: any = null;
let isLoading = false;
let loadError: Error | null = null;

/**
 * Initialize the language model
 */
export async function initModel(
  onProgress?: (progress: number) => void
): Promise<void> {
  if (generator || isLoading) return;
  
  isLoading = true;
  loadError = null;
  
  try {
    console.log('Initializing Transformers.js model: Xenova/LaMini-Flan-T5-77M');
    generator = await pipeline(
      'text2text-generation',
      'Xenova/LaMini-Flan-T5-77M',
      {
        progress_callback: (data: any) => {
          if (data.progress && onProgress) {
            // Progress is typically 0-1, convert to percentage
            const percent = Math.round(data.progress * 100);
            onProgress(percent);
          }
        }
      }
    );
    console.log('Model loaded successfully');
  } catch (error) {
    loadError = error as Error;
    generator = null;
    console.error('Model loading failed:', error);
    
    // Provide more detailed error information
    if (error instanceof Error) {
      if (error.message.includes('CSP') || error.message.includes('Content Security Policy')) {
        throw new Error('Content Security Policy is blocking model download. Please allow connections to huggingface.co');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
        throw new Error('Network error: Unable to download model. Please check your internet connection.');
      }
    }
    
    throw error;
  } finally {
    isLoading = false;
  }
}

/**
 * Check if model is ready
 */
export function isModelReady(): boolean {
  return generator !== null;
}

/**
 * Check if model is currently loading
 */
export function isModelLoading(): boolean {
  return isLoading;
}

/**
 * Get load error if any
 */
export function getLoadError(): Error | null {
  return loadError;
}

/**
 * Generate response using the LLM
 */
export async function generateResponse(
  userMessage: string,
  toolsList: string
): Promise<string> {
  if (!generator) {
    throw new Error('Model not initialized. Call initModel() first.');
  }
  
  const prompt = `You are DevBot, assistant for devtool.site. Help users find and use developer tools. Available tools include: ${toolsList}. 

User question: "${userMessage}"

Provide a helpful, conversational response. If they're looking for a tool, suggest the best match. Keep it brief (1-2 sentences). Be friendly and helpful.`;
  
  try {
    const result = await generator(prompt, {
      max_new_tokens: 80,
      temperature: 0.7,
      do_sample: true,
    });
    
    return result[0]?.generated_text || "I'm not sure how to help with that. Can you rephrase?";
  } catch (error) {
    console.error('LLM generation error:', error);
    throw error;
  }
}

/**
 * Get a simplified list of tools for the prompt
 */
export function getToolsListForPrompt(maxTools: number = 20): string {
  // Get popular tools and a sample of others
  const popular = tools.filter(t => t.isPopular).slice(0, 10);
  const others = tools.filter(t => !t.isPopular).slice(0, maxTools - popular.length);
  const selected = [...popular, ...others];
  
  return selected.map(t => `${t.name} (${t.tagline})`).join(', ');
}

