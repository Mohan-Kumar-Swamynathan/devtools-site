// Re-export from ruleBasedBrain for backward compatibility
import { getRuleBasedResponse, Response } from './ruleBasedBrain';

/**
 * @deprecated Use getRuleBasedResponse from './ruleBasedBrain' instead
 * This function is kept for backward compatibility
 */
export function getResponse(input: string): Response {
  const response = getRuleBasedResponse(input);
  // Remove confidence field for backward compatibility
  const { confidence, ...rest } = response;
  return rest;
      }

// Export Response type for backward compatibility
export type { Response };
