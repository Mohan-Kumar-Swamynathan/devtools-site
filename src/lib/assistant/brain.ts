import { tools, categories, searchTools } from '@/lib/tools';
import { matchIntent } from './intents';
import { getResponseTemplate } from './responses';

interface Response {
  text: string;
  mood?: 'happy' | 'confused' | 'idle';
  toolSlug?: string;
  autoRedirect?: boolean;
}

export function getResponse(input: string): Response {
  const query = input.toLowerCase().trim();
  
  // First, try to find matching tools
  const toolMatches = searchTools(query);
  
  // If we have a strong match, prioritize it
  if (toolMatches.length > 0) {
    const exactMatch = toolMatches.find(t => 
      t.name.toLowerCase() === query ||
      t.slug === query.replace(/\s+/g, '-') ||
      t.keywords.some(k => k.toLowerCase() === query)
    );
    
    if (exactMatch) {
      return {
        text: `Found **${exactMatch.name}** ${exactMatch.icon}\n\n${exactMatch.description}\n\nTaking you there now...`,
        mood: 'happy',
        toolSlug: exactMatch.slug,
        autoRedirect: true
      };
    }
    
    // Single strong match
    if (toolMatches.length === 1) {
      const tool = toolMatches[0];
      return {
        text: `I found **${tool.name}** ${tool.icon}\n\n${tool.tagline}\n\nClick to open it!`,
        mood: 'happy',
        toolSlug: tool.slug,
        autoRedirect: false
      };
    }
    
    // Multiple matches - show top 3
    if (toolMatches.length <= 5) {
      const toolList = toolMatches.slice(0, 3).map(t => 
        `• ${t.icon} **${t.name}** - ${t.tagline}`
      ).join('\n');
      return {
        text: `I found ${toolMatches.length} matching tools:\n\n${toolList}\n\nWhich one would you like to use?`,
        mood: 'happy',
        toolSlug: toolMatches[0].slug
      };
    }
  }
  
  // Match intent
  const intent = matchIntent(query);
  
  switch (intent.type) {
    case 'greeting':
      return { 
        text: getResponseTemplate('greeting'), 
        mood: 'happy' 
      };
    
    case 'list_tools':
      const categoryList = Object.values(categories).map(c => `${c.icon} ${c.name}`).join(', ');
      return { 
        text: `I have **${tools.length}+ tools** across these categories:\n\n${categoryList}\n\nWhat would you like to do?`,
        mood: 'happy'
      };
    
    case 'find_tool':
      if (toolMatches.length > 0) {
        const topMatch = toolMatches[0];
        return {
          text: `I found **${topMatch.name}** ${topMatch.icon}\n\n${topMatch.description}\n\nWould you like to go there?`,
          mood: 'happy',
          toolSlug: topMatch.slug,
          autoRedirect: false
        };
      }
      return { 
        text: `I couldn't find a tool matching "${intent.query}". Try describing what you want to do, like "format JSON" or "encode base64".`, 
        mood: 'confused' 
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
          autoRedirect: false
        };
      }
      return { text: "Which tool would you like help with?", mood: 'idle' };
    
    case 'navigate':
      const targetTool = toolMatches[0] || tools.find(t => 
        t.name.toLowerCase().includes(intent.query!) ||
        t.slug.includes(intent.query!)
      );
      if (targetTool) {
        return { 
          text: `Taking you to **${targetTool.name}** ${targetTool.icon}...`,
          mood: 'happy',
          toolSlug: targetTool.slug,
          autoRedirect: true
        };
      }
      return { 
        text: "I'm not sure which tool you mean. Try searching for a specific tool name or describe what you want to do.", 
        mood: 'confused' 
      };
    
    case 'how_to':
      return {
        text: "Here's how to use the tools:\n\n1. **Search** for a tool using the search bar or ask me\n2. **Click** on a tool card or ask me to take you there\n3. **Use** the tool - paste your data and click the action button\n\nI can help you find tools - just tell me what you want to do!",
        mood: 'happy'
      };
    
    case 'thanks':
      return { text: getResponseTemplate('thanks'), mood: 'happy' };
    
    case 'bye':
      return { text: getResponseTemplate('bye'), mood: 'happy' };
    
    default:
      // Try to find relevant tool from keywords
      if (toolMatches.length > 0) {
        const relevantTool = toolMatches[0];
        return {
          text: `Sounds like you might need **${relevantTool.name}** ${relevantTool.icon}\n\n${relevantTool.tagline}\n\nClick to open it!`,
          mood: 'happy',
          toolSlug: relevantTool.slug,
          autoRedirect: false
        };
      }
      
      return { 
        text: "I can help you:\n\n🔍 **Find tools** - Search by name or describe what you need\n🧭 **Navigate** - Ask me to take you to any tool\n❓ **Get help** - Ask how to use specific tools\n\nWhat would you like to do?",
        mood: 'confused'
      };
  }
}
