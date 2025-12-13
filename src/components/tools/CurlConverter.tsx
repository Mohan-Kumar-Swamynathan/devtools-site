import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function CurlConverter() {
  const [curl, setCurl] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'php'>('javascript');

  const convert = useCallback(() => {
    // Basic curl parser (simplified)
    const urlMatch = curl.match(/curl\s+['"]?([^'"]+)['"]?/);
    if (!urlMatch) {
      setOutput('Invalid cURL command');
      return;
    }

    const url = urlMatch[1];
    const methodMatch = curl.match(/-X\s+(\w+)/);
    const method = methodMatch ? methodMatch[1] : 'GET';
    
    const headerMatches = curl.matchAll(/-H\s+['"]([^'"]+)['"]/g);
    const headers: Record<string, string> = {};
    for (const match of headerMatches) {
      const [key, value] = match[1].split(':').map(s => s.trim());
      headers[key] = value;
    }

    const dataMatch = curl.match(/-d\s+['"]([^'"]+)['"]/);
    const data = dataMatch ? dataMatch[1] : null;

    let code = '';
    if (language === 'javascript') {
      code = `fetch('${url}', {\n`;
      code += `  method: '${method}',\n`;
      if (Object.keys(headers).length > 0) {
        code += `  headers: ${JSON.stringify(headers, null, 2).split('\n').map((l, i) => i === 0 ? l : '    ' + l).join('\n')},\n`;
      }
      if (data) {
        code += `  body: ${JSON.stringify(data)},\n`;
      }
      code += '})';
    } else if (language === 'python') {
      code = `import requests\n\n`;
      code += `response = requests.${method.toLowerCase()}('${url}'`;
      if (Object.keys(headers).length > 0 || data) {
        code += ',\n';
        if (Object.keys(headers).length > 0) {
          code += `    headers=${JSON.stringify(headers)}`;
          if (data) code += ',\n';
        }
        if (data) {
          code += `    data=${JSON.stringify(data)}`;
        }
      }
      code += ')\n';
      code += 'print(response.text)';
    } else if (language === 'php') {
      code = `$ch = curl_init('${url}');\n`;
      code += `curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n`;
      code += `curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${method}');\n`;
      if (Object.keys(headers).length > 0) {
        code += `curl_setopt($ch, CURLOPT_HTTPHEADER, [\n`;
        Object.entries(headers).forEach(([k, v]) => {
          code += `    '${k}: ${v}',\n`;
        });
        code += `]);\n`;
      }
      if (data) {
        code += `curl_setopt($ch, CURLOPT_POSTFIELDS, ${JSON.stringify(data)});\n`;
      }
      code += `$response = curl_exec($ch);\n`;
      code += `curl_close($ch);\n`;
      code += `echo $response;`;
    }

    setOutput(code);
  }, [curl, language]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={curl}
        onChange={setCurl}
        language="bash"
        label="cURL Command"
        placeholder='curl -X GET "https://api.example.com/data" -H "Authorization: Bearer token"'
      />

      <div className="flex flex-wrap items-center gap-3">
        <select value={language} onChange={(e) => { setLanguage(e.target.value as any); convert(); }} className="input-base">
          <option value="javascript">JavaScript (fetch)</option>
          <option value="python">Python (requests)</option>
          <option value="php">PHP (cURL)</option>
        </select>
        <button onClick={convert} disabled={!curl} className="btn-primary">
          Convert
        </button>
        <button onClick={() => { setCurl(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label={`${language.charAt(0).toUpperCase() + language.slice(1)} Code`}
          language={language}
          showLineNumbers
        />
      )}
    </div>
  );
}

