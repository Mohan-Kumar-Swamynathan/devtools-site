import { tools, categories, searchTools, type Tool } from '@/lib/tools';
import { matchIntent } from './intents';
import { getResponseTemplate } from './responses';
import { getToolContext, getContextDescription } from './context';
import { fillInput, triggerCalculation, readResults, clearInputs, exploreTool } from './toolActions';

export interface Response {
  text: string;
  mood?: 'happy' | 'confused' | 'idle';
  toolSlug?: string;
  autoRedirect?: boolean;
  confidence?: number; // 0-1, for hybrid system
  action?: 'fill_input' | 'calculate' | 'read_result' | 'clear' | 'explore';
  actionResult?: any;
}

/**
 * Calculate similarity score between two strings (simple fuzzy matching)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Simple word overlap
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const commonWords = words1.filter(w => words2.includes(w));
  if (commonWords.length === 0) return 0;
  
  return commonWords.length / Math.max(words1.length, words2.length);
}

/**
 * Find tool matches with confidence scores
 */
function findToolMatches(query: string): Array<{ tool: Tool; score: number }> {
  const q = query.toLowerCase().trim();
  const matches: Array<{ tool: Tool; score: number }> = [];
  
  for (const tool of tools) {
    let score = 0;
    
    // Exact name match
    if (tool.name.toLowerCase() === q) {
      score = 1.0;
    }
    // Slug match
    else if (tool.slug === q.replace(/\s+/g, '-')) {
      score = 0.95;
    }
    // Name contains query
    else if (tool.name.toLowerCase().includes(q)) {
      score = 0.8;
    }
    // Tagline match
    else if (tool.tagline.toLowerCase().includes(q)) {
      score = 0.7;
    }
    // Keyword match
    else {
      const keywordMatch = tool.keywords.find(k => k.toLowerCase().includes(q));
      if (keywordMatch) {
        score = 0.6;
      }
      // Fuzzy keyword matching
      else {
        const bestKeywordScore = Math.max(
          ...tool.keywords.map(k => calculateSimilarity(k, q))
        );
        if (bestKeywordScore > 0.3) {
          score = bestKeywordScore * 0.5;
        }
      }
    }
    
    // Boost score for popular tools
    if (tool.isPopular && score > 0) {
      score = Math.min(1.0, score * 1.1);
    }
    
    if (score > 0.2) {
      matches.push({ tool, score });
    }
  }
  
  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Get response using rule-based matching
 */
export function getRuleBasedResponse(input: string): Response {
  const query = input.toLowerCase().trim();
  
  // Find tool matches with scores
  const toolMatches = findToolMatches(query);
  
  // High confidence match (score > 0.7)
  if (toolMatches.length > 0 && toolMatches[0].score > 0.7) {
    const exactMatch = toolMatches[0];
    return {
      text: `Found **${exactMatch.tool.name}** ${exactMatch.tool.icon}\n\n${exactMatch.tool.description}\n\nTaking you there now...`,
      mood: 'happy',
      toolSlug: exactMatch.tool.slug,
      autoRedirect: true,
      confidence: exactMatch.score
    };
  }
  
  // Single strong match (score > 0.5)
  if (toolMatches.length === 1 && toolMatches[0].score > 0.5) {
    const tool = toolMatches[0].tool;
    return {
      text: `I found **${tool.name}** ${tool.icon}\n\n${tool.tagline}\n\nClick to open it!`,
      mood: 'happy',
      toolSlug: tool.slug,
      autoRedirect: false,
      confidence: toolMatches[0].score
    };
  }
  
  // Multiple good matches
  if (toolMatches.length > 1 && toolMatches.length <= 5) {
    const topMatches = toolMatches.slice(0, 3);
    const toolList = topMatches.map(({ tool }) => 
      `• ${tool.icon} **${tool.name}** - ${tool.tagline}`
    ).join('\n');
    return {
      text: `I found ${toolMatches.length} matching tools:\n\n${toolList}\n\nWhich one would you like to use?`,
      mood: 'happy',
      toolSlug: topMatches[0].tool.slug,
      confidence: topMatches[0].score
    };
  }
  
  // Match intent
  const intent = matchIntent(query);
  
  // Get current context for tool interaction intents
  const context = typeof window !== 'undefined' ? getToolContext() : null;
  
  switch (intent.type) {
    case 'fill_input':
      if (!context || context.pageType !== 'tool') {
        return {
          text: "I can only fill inputs when you're on a tool page. Navigate to a tool first!",
          mood: 'confused',
          confidence: 0.8
        };
      }
      
      if (!intent.field || !intent.value) {
        return {
          text: "I need to know which field and what value. Try: 'set loan amount to 100000'",
          mood: 'confused',
          confidence: 0.7
        };
      }
      
      const fillResult = fillInput(intent.field, intent.value);
      return {
        text: fillResult.success 
          ? `✅ ${fillResult.message || `Set ${intent.field} to ${intent.value}`}`
          : `❌ ${fillResult.message || 'Could not fill input'}`,
        mood: fillResult.success ? 'happy' : 'confused',
        confidence: fillResult.success ? 0.9 : 0.5,
        action: 'fill_input',
        actionResult: fillResult
      };
    
    case 'calculate':
      if (!context || context.pageType !== 'tool') {
        return {
          text: "I can only calculate when you're on a tool page. Navigate to a tool first!",
          mood: 'confused',
          confidence: 0.8
        };
      }
      
      const calcResult = triggerCalculation();
      // Wait a bit for calculation to complete, then read results
      setTimeout(() => {
        const readResult = readResults();
        if (readResult.success) {
          // Update the response with results
          const resultElement = document.querySelector('[data-assistant-result]');
          if (resultElement) {
            resultElement.textContent = readResult.message || '';
          }
        }
      }, 500);
      
      return {
        text: calcResult.success 
          ? `✅ ${calcResult.message || 'Calculation triggered!'}`
          : `❌ ${calcResult.message || 'Could not trigger calculation'}`,
        mood: calcResult.success ? 'happy' : 'confused',
        confidence: calcResult.success ? 0.9 : 0.5,
        action: 'calculate',
        actionResult: calcResult
      };
    
    case 'read_result':
      if (!context || context.pageType !== 'tool') {
        return {
          text: "I can only read results when you're on a tool page with calculated results.",
          mood: 'confused',
          confidence: 0.8
        };
      }
      
      const readResult = readResults();
      return {
        text: readResult.success 
          ? `📊 ${readResult.message || 'Results read successfully'}`
          : `❌ ${readResult.message || 'No results available yet'}`,
        mood: readResult.success ? 'happy' : 'confused',
        confidence: readResult.success ? 0.9 : 0.5,
        action: 'read_result',
        actionResult: readResult
      };
    
    case 'explore':
      if (!context || context.pageType !== 'tool') {
        return {
          text: "I can explore tools when you're on a tool page. Navigate to a tool first!",
          mood: 'confused',
          confidence: 0.8
        };
      }
      
      const exploration = exploreTool(context);
      return {
        text: exploration,
        mood: 'happy',
        confidence: 0.9,
        action: 'explore',
        actionResult: { context }
      };
    
    case 'clear':
      if (!context || context.pageType !== 'tool') {
        return {
          text: "I can only clear inputs when you're on a tool page.",
          mood: 'confused',
          confidence: 0.8
        };
      }
      
      const clearResult = clearInputs();
      return {
        text: clearResult.success 
          ? `✅ ${clearResult.message || 'All inputs cleared'}`
          : `❌ ${clearResult.message || 'Could not clear inputs'}`,
        mood: clearResult.success ? 'happy' : 'confused',
        confidence: clearResult.success ? 0.9 : 0.5,
        action: 'clear',
        actionResult: clearResult
      };
    case 'greeting':
      // Context-aware greeting
      if (context && context.pageType === 'tool' && context.tool) {
        const contextDesc = getContextDescription(context);
        let guidance = '';
        
        if (context.tool.slug === 'loan-calculator') {
          guidance = '\n\n**Try these voice commands:**\n• "set loan amount to 500000"\n• "set interest rate to 8.5"\n• "set loan term to 20 years"\n• "calculate" or "what\'s my EMI"\n• "explore this tool" for more options';
        } else {
          guidance = '\n\n**Try saying:**\n• "set [field] to [value]"\n• "calculate"\n• "explore this tool"';
        }
        
        return {
          text: `Hi! 👋 I can help you use **${context.tool.name}** ${context.tool.icon}\n\n${contextDesc}${guidance}`,
          mood: 'happy',
          confidence: 0.9
        };
      }
      return { 
        text: getResponseTemplate('greeting'), 
        mood: 'happy',
        confidence: 0.9
      };
    
    case 'list_tools':
      const categoryList = Object.values(categories).map(c => `${c.icon} ${c.name}`).join(', ');
      return { 
        text: `I have **${tools.length}+ tools** across these categories:\n\n${categoryList}\n\nWhat would you like to do?`,
        mood: 'happy',
        confidence: 0.9
      };
    
    case 'find_tool':
      if (toolMatches.length > 0) {
        const topMatch = toolMatches[0];
        return {
          text: `I found **${topMatch.tool.name}** ${topMatch.tool.icon}\n\n${topMatch.tool.description}\n\nWould you like to go there?`,
          mood: 'happy',
          toolSlug: topMatch.tool.slug,
          autoRedirect: false,
          confidence: topMatch.score
        };
      }
      return { 
        text: `I couldn't find a tool matching "${intent.query}". Try describing what you want to do, like "format JSON" or "encode base64".`, 
        mood: 'confused',
        confidence: 0.3 // Low confidence - might benefit from LLM
      };
    
    case 'tool_help':
      const tool = tools.find(t => 
        t.slug === intent.toolSlug ||
        t.name.toLowerCase().includes(intent.toolSlug || '')
      );
      if (tool) {
        return {
          text: `**${tool.name}** ${tool.icon}\n\n${tool.description}\n\nClick to open it!`,
          mood: 'happy',
          toolSlug: tool.slug,
          autoRedirect: false,
          confidence: 0.8
        };
      }
      return { 
        text: "Which tool would you like help with?", 
        mood: 'idle',
        confidence: 0.4
      };
    
    case 'navigate':
      const targetTool = toolMatches[0]?.tool || tools.find(t => 
        t.name.toLowerCase().includes(intent.query!) ||
        t.slug.includes(intent.query!)
      );
      if (targetTool) {
        return { 
          text: `Taking you to **${targetTool.name}** ${targetTool.icon}...`,
          mood: 'happy',
          toolSlug: targetTool.slug,
          autoRedirect: true,
          confidence: 0.8
        };
      }
      return { 
        text: "I'm not sure which tool you mean. Try searching for a specific tool name or describe what you want to do.", 
        mood: 'confused',
        confidence: 0.3
      };
    
    case 'how_to':
      return {
        text: "Here's how to use the tools:\n\n1. **Search** for a tool using the search bar or ask me\n2. **Click** on a tool card or ask me to take you there\n3. **Use** the tool - paste your data and click the action button\n\nI can help you find tools - just tell me what you want to do!",
        mood: 'happy',
        confidence: 0.9
      };
    
    case 'thanks':
      return { 
        text: getResponseTemplate('thanks'), 
        mood: 'happy',
        confidence: 0.9
      };
    
    case 'bye':
      return { 
        text: getResponseTemplate('bye'), 
        mood: 'happy',
        confidence: 0.9
      };
    
    default:
      // Try to find relevant tool from keywords
      if (toolMatches.length > 0) {
        const relevantTool = toolMatches[0];
        return {
          text: `Sounds like you might need **${relevantTool.tool.name}** ${relevantTool.tool.icon}\n\n${relevantTool.tool.tagline}\n\nClick to open it!`,
          mood: 'happy',
          toolSlug: relevantTool.tool.slug,
          autoRedirect: false,
          confidence: relevantTool.score
        };
      }
      
      // Low confidence - might benefit from LLM
      return { 
        text: "I can help you:\n\n🔍 **Find tools** - Search by name or describe what you need\n🧭 **Navigate** - Ask me to take you to any tool\n❓ **Get help** - Ask how to use specific tools\n\nWhat would you like to do?",
        mood: 'confused',
        confidence: 0.3
      };
  }
}
