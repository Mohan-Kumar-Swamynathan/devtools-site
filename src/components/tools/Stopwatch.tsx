import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(performance.now() - startTimeRef.current);
      }, 10);
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
  }, [isRunning, time]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((milliseconds % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    if (isRunning && time > 0) {
      const lastLapTime = laps.length > 0 
        ? laps.reduce((sum, lap) => sum + lap, 0)
        : 0;
      const lapTime = time - lastLapTime;
      setLaps([...laps, lapTime]);
    }
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    startTimeRef.current = 0;
  };

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl font-bold font-mono mb-4" style={{ color: 'var(--text-primary)' }}>
            {formatTime(time)}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn btn-primary flex items-center gap-2"
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleLap}
            disabled={!isRunning || time === 0}
            className="btn btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <Flag size={20} />
            Lap
          </button>
          <button
            onClick={handleReset}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>

        {laps.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Lap Times
            </h3>
            <div className="p-4 rounded-xl border max-h-96 overflow-y-auto" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="space-y-2">
                {laps.map((lap, index) => {
                  const previousLapsTotal = laps.slice(0, index).reduce((sum, l) => sum + l, 0);
                  const totalTime = previousLapsTotal + lap;
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-primary)'
                      }}
                    >
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Lap {index + 1}
                      </div>
                      <div className="font-mono text-lg" style={{ color: 'var(--text-primary)' }}>
                        {formatTime(lap)}
                      </div>
                      <div className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                        {formatTime(totalTime)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

