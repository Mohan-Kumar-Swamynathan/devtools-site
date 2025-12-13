import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function JsonSchemaValidator() {
  const [json, setJson] = useState('');
  const [schema, setSchema] = useState('');
  const [result, setResult] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validate = useCallback(() => {
    try {
      const jsonObj = JSON.parse(json);
      const schemaObj = JSON.parse(schema);
      
      // Basic schema validation (simplified)
      const validateValue = (value: any, schema: any): string[] => {
        const errors: string[] = [];
        
        if (schema.type) {
          if (schema.type === 'object' && typeof value !== 'object' || Array.isArray(value)) {
            errors.push(`Expected object, got ${typeof value}`);
          } else if (schema.type === 'array' && !Array.isArray(value)) {
            errors.push(`Expected array, got ${typeof value}`);
          } else if (schema.type === 'string' && typeof value !== 'string') {
            errors.push(`Expected string, got ${typeof value}`);
          } else if (schema.type === 'number' && typeof value !== 'number') {
            errors.push(`Expected number, got ${typeof value}`);
          } else if (schema.type === 'boolean' && typeof value !== 'boolean') {
            errors.push(`Expected boolean, got ${typeof value}`);
          }
        }
        
        if (schema.required && Array.isArray(schema.required)) {
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            schema.required.forEach((prop: string) => {
              if (!(prop in value)) {
                errors.push(`Missing required property: ${prop}`);
              }
            });
          }
        }
        
        if (schema.properties && typeof value === 'object' && value !== null && !Array.isArray(value)) {
          Object.entries(schema.properties).forEach(([key, propSchema]: [string, any]) => {
            if (key in value) {
              errors.push(...validateValue(value[key], propSchema).map(e => `${key}.${e}`));
            }
          });
        }
        
        return errors;
      };
      
      const errors = validateValue(jsonObj, schemaObj);
      if (errors.length === 0) {
        setIsValid(true);
        setResult('✓ JSON is valid according to the schema');
      } else {
        setIsValid(false);
        setResult('✗ Validation errors:\n' + errors.join('\n'));
      }
    } catch (e) {
      setIsValid(false);
      setResult(`Error: ${(e as Error).message}`);
    }
  }, [json, schema]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CodeEditor
          value={json}
          onChange={setJson}
          language="json"
          label="JSON to Validate"
          placeholder='{"name": "John", "age": 30}'
        />
        <CodeEditor
          value={schema}
          onChange={setSchema}
          language="json"
          label="JSON Schema"
          placeholder='{"type": "object", "properties": {"name": {"type": "string"}}}'
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={validate} disabled={!json || !schema} className="btn-primary">
          Validate
        </button>
        <button onClick={() => { setJson(''); setSchema(''); setResult(''); setIsValid(null); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {result && (
        <div>
          <label className="label">Validation Result</label>
          <div className={`p-4 rounded-xl border ${isValid ? 'alert-success' : 'alert-error'}`}>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

