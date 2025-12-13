import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (theme === 'system') {
      localStorage.removeItem('theme');
      root.classList.toggle('dark', prefersDark);
    } else {
      localStorage.setItem('theme', theme);
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);

  const cycleTheme = () => {
    const next: Record<Theme, Theme> = {
      'light': 'dark',
      'dark': 'system',
      'system': 'light'
    };
    setTheme(next[theme]);
  };

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const label = theme === 'light' ? 'Light mode' : theme === 'dark' ? 'Dark mode' : 'System theme';

  return (
    <button
      onClick={cycleTheme}
      className="btn-icon touch-target"
      aria-label={label}
      title={label}
    >
      <Icon size={20} />
    </button>
  );
}


