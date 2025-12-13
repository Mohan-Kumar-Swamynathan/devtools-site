import { ArrowRight } from 'lucide-react';
import { marked } from 'marked';

interface Props {
  role: 'user' | 'assistant';
  content: string;
  tool?: any;
  onToolClick?: () => void;
}

export default function MessageBubble({ role, content, tool, onToolClick }: Props) {
  const isUser = role === 'user';
  
  // Simple markdown to HTML conversion
  const htmlContent = marked.parse(content);

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{ backgroundColor: 'var(--brand-primary-light)', color: 'var(--brand-primary)' }}>
          🤖
        </div>
      )}
      
      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block px-4 py-2.5 rounded-2xl max-w-[85%] ${
            isUser 
              ? 'rounded-tr-sm' 
              : 'rounded-tl-sm'
          }`}
          style={{
            backgroundColor: isUser ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
            color: isUser ? 'white' : 'var(--text-primary)'
          }}
        >
          <div 
            className="text-sm leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{
              color: isUser ? 'white' : 'var(--text-primary)'
            }}
          />
        </div>
        
        {tool && onToolClick && (
          <button
            onClick={onToolClick}
            className="mt-3 px-4 py-2.5 rounded-xl border-2 transition-all hover:scale-105 flex items-center gap-2 group"
            style={{
              borderColor: 'var(--brand-primary)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--brand-primary)'
            }}
          >
            <span className="text-lg">{tool.icon}</span>
            <span className="font-medium">{tool.name}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
          👤
        </div>
      )}
    </div>
  );
}
