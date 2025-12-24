import { useState, useMemo, useEffect } from 'react';
import { Table, ArrowUpDown } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

type SortDirection = 'asc' | 'desc' | null;
type SortConfig = { key: string; direction: SortDirection };

export default function JsonToTable() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });
  const [filter, setFilter] = useState('');

  const { data, errorMessage } = useMemo(() => {
    if (!jsonInput.trim()) {
      return { data: null, errorMessage: '' };
    }

    try {
      const parsed = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsed)) {
        return { data: null, errorMessage: 'JSON must be an array of objects.' };
      }

      if (parsed.length === 0) {
        return { data: null, errorMessage: 'Array is empty.' };
      }

      if (!parsed.every(item => typeof item === 'object' && item !== null)) {
        return { data: null, errorMessage: 'All array items must be objects.' };
      }

      return { data: parsed, errorMessage: '' };
    } catch (err) {
      return { data: null, errorMessage: 'Invalid JSON format.' };
    }
  }, [jsonInput]);

  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    const keys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => keys.add(key));
    });
    return Array.from(keys);
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    let result = [...data];

    // Apply filter
    if (filter) {
      const filterLower = filter.toLowerCase();
      result = result.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(filterLower)
        )
      );
    }

    // Apply sort
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, filter, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prev.direction === 'desc') {
          return { key: '', direction: null };
        }
      }
      return { key, direction: 'asc' };
    });
  };

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Table size={20} />
          JSON Input
        </h3>
        <div className="p-4 rounded-xl border" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="input w-full font-mono"
            rows={8}
            placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
          />
          {error && (
            <div className="mt-3 p-3 rounded-lg text-sm" style={{
              backgroundColor: 'var(--status-error)',
              color: 'white'
            }}>
              {error}
            </div>
          )}
        </div>
      </div>

      {data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Table View ({filteredAndSortedData.length} rows)
            </h3>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input w-64"
              placeholder="Filter rows..."
            />
          </div>
          <div className="p-4 rounded-xl border overflow-x-auto" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
                  {columns.map(col => (
                    <th
                      key={col}
                      className="text-left p-3 font-semibold cursor-pointer hover:bg-opacity-50"
                      style={{ 
                        color: 'var(--text-primary)',
                        backgroundColor: sortConfig.key === col ? 'var(--bg-primary)' : 'transparent'
                      }}
                      onClick={() => handleSort(col)}
                    >
                      <div className="flex items-center gap-2">
                        {col}
                        <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
                        {sortConfig.key === col && (
                          <span className="text-xs">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-opacity-50"
                    style={{
                      borderColor: 'var(--border-primary)',
                      backgroundColor: index % 2 === 0 ? 'var(--bg-primary)' : 'transparent'
                    }}
                  >
                    {columns.map(col => (
                      <td key={col} className="p-3" style={{ color: 'var(--text-primary)' }}>
                        {row[col] !== null && row[col] !== undefined
                          ? String(row[col])
                          : <span style={{ color: 'var(--text-muted)' }}>—</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

