import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { FileCode, AlertCircle } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface JsonSchema {
  $schema?: string;
  type: string;
  properties?: Record<string, any>;
  items?: any;
  required?: string[];
  additionalProperties?: boolean;
}

export default function JsonSchemaGenerator() {
  const [input, setInput] = useState('');
  const [schema, setSchema] = useState('');
  const [error, setError] = useState('');

  const inferType = (value: any): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };

  const generateSchema = useCallback((obj: any, title?: string): JsonSchema => {
    const type = inferType(obj);
    const schema: JsonSchema = { type };

    if (type === 'object' && obj !== null) {
      schema.properties = {};
      schema.required = [];
      schema.additionalProperties = false;

      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          schema.properties[key] = generateSchema(value, key);
          schema.required!.push(key);
        }
      }
    } else if (type === 'array' && obj.length > 0) {
      schema.items = generateSchema(obj[0]);
    } else if (type === 'string') {
      schema.minLength = 0;
    } else if (type === 'number') {
      schema.minimum = typeof obj === 'number' ? obj : undefined;
    }

    return schema;
  }, []);

  const handleGenerate = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const generatedSchema = generateSchema(parsed);
      generatedSchema.$schema = 'http://json-schema.org/draft-07/schema#';
      setSchema(JSON.stringify(generatedSchema, null, 2));
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setSchema('');
    }
  }, [input, generateSchema]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={handleGenerate} disabled={!input} className="btn-primary flex items-center gap-2">
          <FileCode size={16} />
          Generate Schema
        </button>
        <button onClick={() => { setInput(''); setSchema(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <CodeEditor
        value={input}
        onChange={setInput}
        language="json"
        label="JSON Input"
        placeholder='{"name": "John", "age": 30, "email": "john@example.com"}'
        rows={12}
      />

{/* Controls moved to header */}









      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {schema && (
        <OutputPanel
          value={schema}
          label="Generated JSON Schema"
          language="json"
          showLineNumbers
        />
      )}
    </ToolShell>
  );
}








