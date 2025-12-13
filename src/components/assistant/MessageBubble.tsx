interface Props {
  role: 'user' | 'assistant';
  content: string;
}

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
          isUser ? 'rounded-br-md' : 'rounded-bl-md'
        }`}
        style={{
          backgroundColor: isUser ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
          color: isUser ? 'white' : 'var(--text-primary)'
        }}
      >
        {content}
      </div>
    </div>
  );
}

