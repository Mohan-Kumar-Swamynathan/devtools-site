import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getDuration = useCallback(() => {
    switch (mode) {
      case 'pomodoro':
        return POMODORO_DURATION;
      case 'shortBreak':
        return SHORT_BREAK;
      case 'longBreak':
        return LONG_BREAK;
    }
  }, [mode]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Show notification
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification(mode === 'pomodoro' ? 'Pomodoro Complete!' : 'Break Complete!', {
                body: mode === 'pomodoro' 
                  ? 'Time for a break!' 
                  : 'Ready to focus again?',
                icon: '/favicon.ico',
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode]);

  useEffect(() => {
    setTimeLeft(getDuration());
    setIsRunning(false);
  }, [mode, getDuration]);

  const requestNotificationPermission = useCallback(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((getDuration() - timeLeft) / getDuration()) * 100;

  const handleComplete = () => {
    if (mode === 'pomodoro') {
      setCompletedPomodoros((prev) => prev + 1);
      if ((completedPomodoros + 1) % 4 === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('pomodoro');
    }
    setTimeLeft(getDuration());
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setMode('pomodoro')}
            className={`btn ${mode === 'pomodoro' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => setMode('shortBreak')}
            className={`btn ${mode === 'shortBreak' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Short Break
          </button>
          <button
            onClick={() => setMode('longBreak')}
            className={`btn ${mode === 'longBreak' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Long Break
          </button>
        </div>

        <div className="relative w-64 h-64 mx-auto mb-6">
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="var(--border-primary)"
              strokeWidth="8"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              {mode === 'pomodoro' ? 'Focus Time' : 'Break Time'}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn btn-primary flex items-center gap-2"
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => {
              setTimeLeft(getDuration());
              setIsRunning(false);
            }}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Reset
          </button>
          {timeLeft === 0 && (
            <button
              onClick={handleComplete}
              className="btn btn-success flex items-center gap-2"
            >
              <Bell size={20} />
              Complete
            </button>
          )}
        </div>

        <div className="text-center p-4 rounded-xl border" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Completed Pomodoros Today
          </div>
          <div className="text-3xl font-bold mt-2" style={{ color: 'var(--brand-primary)' }}>
            {completedPomodoros}
          </div>
        </div>

        {typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && (
          <div className="mt-4 p-3 rounded-lg border text-sm text-center" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-muted)'
          }}>
            <button
              onClick={requestNotificationPermission}
              className="text-brand-primary underline"
            >
              Enable notifications
            </button>
            {' '}to get alerts when timer completes
          </div>
        )}
      </div>
    </div>
  );
}

