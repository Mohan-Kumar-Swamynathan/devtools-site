import clsx from 'clsx';

type Mood = 'idle' | 'thinking' | 'happy' | 'confused';

interface Props {
  mood: Mood;
  size?: number;
}

export default function AssistantAvatar({ mood, size = 60 }: Props) {
  return (
    <div
        className={clsx(
        'relative transition-transform duration-300',
        mood === 'idle' && 'animate-float',
        mood === 'thinking' && 'animate-pulse-soft',
        mood === 'happy' && 'animate-bounce-soft'
      )}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Body */}
        <circle cx="50" cy="50" r="40" fill="url(#avatarGrad)" />
        
        {/* Highlight */}
        <ellipse cx="50" cy="38" rx="28" ry="18" fill="rgba(255,255,255,0.15)" />

        {/* Eyes */}
        {mood !== 'thinking' ? (
          <>
            <ellipse cx="38" cy="45" rx="5" ry="5" fill="white" />
            <circle cx="38" cy="45" r="2.5" fill="#1e293b" />
            <ellipse cx="62" cy="45" rx="5" ry="5" fill="white" />
            <circle cx="62" cy="45" r="2.5" fill="#1e293b" />
          </>
        ) : (
          <>
            <circle cx="35" cy="45" r="3" fill="white" className="animate-pulse" />
            <circle cx="50" cy="45" r="3" fill="white" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
            <circle cx="65" cy="45" r="3" fill="white" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
          </>
        )}

        {/* Mouth */}
        {mood === 'idle' && <path d="M 40 62 Q 50 70 60 62" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />}
        {mood === 'happy' && <path d="M 38 60 Q 50 75 62 60" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />}
        {mood === 'confused' && <path d="M 42 64 L 58 64" stroke="white" strokeWidth="3" strokeLinecap="round" />}
        {mood === 'thinking' && <path d="M 44 64 Q 50 60 56 64" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />}

        {/* Antenna */}
        <line x1="50" y1="10" x2="50" y2="2" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="2" r="4" fill="#60a5fa" />
      </svg>
    </div>
  );
}

