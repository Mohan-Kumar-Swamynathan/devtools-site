import { useState, useEffect, useCallback } from 'react';
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

  const cycleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Record<Theme, Theme> = {
        'light': 'dark',
        'dark': 'system',
        'system': 'light'
      };
      return next[current];
    });
  }, []);

  // Keyboard shortcut for theme toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        cycleTheme();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cycleTheme]);

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


