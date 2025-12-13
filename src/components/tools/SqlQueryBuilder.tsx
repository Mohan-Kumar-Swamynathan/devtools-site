import { useState, useCallback } from 'react';
import { Database, Copy } from 'lucide-react';

type Column = {
  name: string;
  selected: boolean;
};

type Table = {
  name: string;
  selected: boolean;
  columns: Column[];
};

export default function SqlQueryBuilder() {
  const [tables, setTables] = useState<Table[]>([
    { name: 'users', selected: false, columns: [{ name: 'id', selected: false }, { name: 'name', selected: false }, { name: 'email', selected: false }] },
    { name: 'orders', selected: false, columns: [{ name: 'id', selected: false }, { name: 'user_id', selected: false }, { name: 'total', selected: false }] },
  ]);
  const [queryType, setQueryType] = useState<'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'>('SELECT');
  const [whereClause, setWhereClause] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [limit, setLimit] = useState('');

  const generateQuery = useCallback(() => {
    const selectedTables = tables.filter(t => t.selected);
    const selectedColumns = tables.flatMap(t => 
      t.columns.filter(c => c.selected).map(c => `${t.name}.${c.name}`)
    );

    let query = '';

    switch (queryType) {
      case 'SELECT':
        query = 'SELECT ';
        query += selectedColumns.length > 0 
          ? selectedColumns.join(', ') 
          : '*';
        query += '\nFROM ';
        query += selectedTables.length > 0 
          ? selectedTables.map(t => t.name).join(', ')
          : 'table_name';
        if (whereClause) {
          query += `\nWHERE ${whereClause}`;
        }
        if (orderBy) {
          query += `\nORDER BY ${orderBy}`;
        }
        if (limit) {
          query += `\nLIMIT ${limit}`;
        }
        break;
      case 'INSERT':
        query = `INSERT INTO ${selectedTables[0]?.name || 'table_name'}`;
        if (selectedColumns.length > 0) {
          query += ` (${selectedColumns.map(c => c.split('.')[1]).join(', ')})`;
        }
        query += '\nVALUES (';
        query += selectedColumns.map(() => '?').join(', ');
        query += ')';
        break;
      case 'UPDATE':
        query = `UPDATE ${selectedTables[0]?.name || 'table_name'}`;
        query += '\nSET ';
        query += selectedColumns.length > 0
          ? selectedColumns.map(c => `${c.split('.')[1]} = ?`).join(', ')
          : 'column = ?';
        if (whereClause) {
          query += `\nWHERE ${whereClause}`;
        }
        break;
      case 'DELETE':
        query = `DELETE FROM ${selectedTables[0]?.name || 'table_name'}`;
        if (whereClause) {
          query += `\nWHERE ${whereClause}`;
        }
        break;
    }

    return query;
  }, [tables, queryType, whereClause, orderBy, limit]);

  const query = generateQuery();

  const toggleTable = (tableIndex: number) => {
    setTables(prev => prev.map((t, i) => 
      i === tableIndex ? { ...t, selected: !t.selected } : t
    ));
  };

  const toggleColumn = (tableIndex: number, columnIndex: number) => {
    setTables(prev => prev.map((t, i) => 
      i === tableIndex 
        ? {
            ...t,
            columns: t.columns.map((c, ci) => 
              ci === columnIndex ? { ...c, selected: !c.selected } : c
            )
          }
        : t
    ));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Database size={20} />
            Query Builder
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Query Type</label>
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value as any)}
                className="input w-full"
              >
                <option value="SELECT">SELECT</option>
                <option value="INSERT">INSERT</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="label">Tables</label>
              <div className="space-y-2">
                {tables.map((table, tableIndex) => (
                  <div key={tableIndex} className="p-3 rounded-lg border" style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-primary)'
                  }}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={table.selected}
                        onChange={() => toggleTable(tableIndex)}
                        className="checkbox"
                      />
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {table.name}
                      </span>
                    </label>
                    {table.selected && (
                      <div className="mt-2 ml-6 space-y-1">
                        {table.columns.map((column, columnIndex) => (
                          <label key={columnIndex} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={column.selected}
                              onChange={() => toggleColumn(tableIndex, columnIndex)}
                              className="checkbox"
                            />
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                              {column.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {queryType === 'SELECT' && (
              <>
                <div>
                  <label className="label">WHERE Clause</label>
                  <input
                    type="text"
                    value={whereClause}
                    onChange={(e) => setWhereClause(e.target.value)}
                    className="input w-full font-mono"
                    placeholder="id = 1"
                  />
                </div>
                <div>
                  <label className="label">ORDER BY</label>
                  <input
                    type="text"
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                    className="input w-full font-mono"
                    placeholder="name ASC"
                  />
                </div>
                <div>
                  <label className="label">LIMIT</label>
                  <input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="input w-full"
                    placeholder="10"
                    min="1"
                  />
                </div>
              </>
            )}

            {(queryType === 'UPDATE' || queryType === 'DELETE') && (
              <div>
                <label className="label">WHERE Clause</label>
                <input
                  type="text"
                  value={whereClause}
                  onChange={(e) => setWhereClause(e.target.value)}
                  className="input w-full font-mono"
                  placeholder="id = 1"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Generated SQL
            </h3>
            <button
              onClick={handleCopy}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Copy size={16} />
              Copy
            </button>
          </div>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <pre className="font-mono text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
              {query}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

