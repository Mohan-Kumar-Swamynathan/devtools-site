import { useState, useCallback, useRef } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const startTimeRef = useRef<number>(0);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    startTimeRef.current = performance.now();
    
    // Collect performance metrics
    if ('performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics({
        memory: {
          used: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
          total: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
          limit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
        },
        timing: {
          navigation: performance.timing ? {
            dns: performance.timing.domainLookupEnd - performance.timing.domainLookupStart,
            tcp: performance.timing.connectEnd - performance.timing.connectStart,
            request: performance.timing.responseStart - performance.timing.requestStart,
            response: performance.timing.responseEnd - performance.timing.responseStart,
            dom: performance.timing.domContentLoadedEventEnd - performance.timing.domLoading,
            load: performance.timing.loadEventEnd - performance.timing.navigationStart
          } : null
        },
        navigation: performance.getEntriesByType('navigation').map((entry: any) => ({
          type: entry.type,
          duration: entry.duration.toFixed(2) + ' ms',
          size: entry.transferSize ? (entry.transferSize / 1024).toFixed(2) + ' KB' : 'N/A'
        }))
      });
    } else {
      setMetrics({
        message: 'Performance API not fully supported in this browser',
        timing: performance.timing ? {
          load: performance.timing.loadEventEnd - performance.timing.navigationStart
        } : null
      });
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    const endTime = performance.now();
    const duration = (endTime - startTimeRef.current).toFixed(2);
    
    setMetrics((prev: any) => ({
      ...prev,
      duration: duration + ' ms'
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Monitor browser performance metrics including memory usage, navigation timing, and resource loading.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={isMonitoring ? stopMonitoring : startMonitoring} 
          className={isMonitoring ? 'btn-error' : 'btn-primary'}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
        <button onClick={() => setMetrics(null)} className="btn-ghost">
          Clear
        </button>
      </div>

      {metrics && (
        <div className="space-y-4">
          {metrics.duration && (
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
              <div className="text-2xl font-bold">{metrics.duration}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Total Duration</div>
            </div>
          )}
          <OutputPanel
            value={JSON.stringify(metrics, null, 2)}
            label="Performance Metrics"
            language="json"
            showLineNumbers
          />
        </div>
      )}
    </div>
  );
}

