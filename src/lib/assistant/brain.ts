import { tools, categories } from '@/lib/tools';
import { matchIntent } from './intents';
import { getResponseTemplate } from './responses';

interface Response {
  text: string;
  mood?: 'happy' | 'confused' | 'idle';
  action?: { type: 'navigate'; url: string };
}

export function getResponse(input: string): Response {
  const query = input.toLowerCase().trim();
  
  // Match intent
  const intent = matchIntent(query);
  
  switch (intent.type) {
    case 'greeting':
      return { text: getResponseTemplate('greeting'), mood: 'happy' };
    
    case 'list_tools':
      const categoryList = Object.values(categories).map(c => `${c.icon} ${c.name}`).join(', ');
      return { 
        text: `I have ${tools.length}+ tools across these categories: ${categoryList}. What would you like to do?`,
        mood: 'happy'
      };
    
    case 'find_tool':
      const matchedTools = tools.filter(t => 
        t.name.toLowerCase().includes(intent.query!) ||
        t.keywords.some(k => k.toLowerCase().includes(intent.query!))
      ).slice(0, 3);
      
      if (matchedTools.length > 0) {
        const toolList = matchedTools.map(t => `${t.icon} ${t.name}`).join(', ');
        return {
          text: `I found these tools: ${toolList}. Would you like me to take you to one of them?`,
          mood: 'happy'
        };
      }
      return { text: `I couldn't find a tool matching "${intent.query}". Try describing what you want to do.`, mood: 'confused' };
    
    case 'tool_help':
      const tool = tools.find(t => 
        t.slug === intent.toolSlug ||
        t.name.toLowerCase().includes(intent.toolSlug || '')
      );
      if (tool) {
        return {
          text: `${tool.icon} ${tool.name}: ${tool.description} Would you like to go there?`,
          mood: 'happy'
        };
      }
      return { text: "Which tool would you like help with?", mood: 'idle' };
    
    case 'navigate':
      const targetTool = tools.find(t => 
        t.name.toLowerCase().includes(intent.query!) ||
        t.slug.includes(intent.query!)
      );
      if (targetTool) {
        // Trigger navigation
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.location.href = `/${targetTool.slug}`;
          }, 1000);
        }
        return { 
          text: `Taking you to ${targetTool.name}...`,
          mood: 'happy',
          action: { type: 'navigate', url: `/${targetTool.slug}` }
        };
      }
      return { text: "I'm not sure which tool you mean. Could you be more specific?", mood: 'confused' };
    
    case 'how_to':
      return {
        text: "Just paste your data in the input area and click the action button. I can also help you find the right tool - just tell me what you want to do!",
        mood: 'happy'
      };
    
    case 'thanks':
      return { text: getResponseTemplate('thanks'), mood: 'happy' };
    
    case 'bye':
      return { text: getResponseTemplate('bye'), mood: 'happy' };
    
    default:
      // Try to find relevant tool
      const relevantTool = tools.find(t =>
        t.keywords.some(k => query.includes(k)) ||
        query.includes(t.name.toLowerCase())
      );
      
      if (relevantTool) {
        return {
          text: `Sounds like you might need ${relevantTool.icon} ${relevantTool.name}. ${relevantTool.tagline}. Want me to take you there?`,
          mood: 'happy'
        };
      }
      
      return { 
        text: "I'm not sure I understand. I can help you find tools, explain how they work, or navigate the site. What would you like to do?",
        mood: 'confused'
      };
  }
}

