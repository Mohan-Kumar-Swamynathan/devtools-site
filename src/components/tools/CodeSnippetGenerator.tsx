import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const snippets: Record<string, Record<string, string>> = {
  javascript: {
    'Function': 'function example() {\n  return "Hello World";\n}',
    'Arrow Function': 'const example = () => {\n  return "Hello World";\n};',
    'Async Function': 'async function fetchData() {\n  const response = await fetch(url);\n  return response.json();\n}',
    'Class': 'class Example {\n  constructor(name) {\n    this.name = name;\n  }\n  \n  greet() {\n    return `Hello, ${this.name}`;\n  }\n}',
    'Promise': 'new Promise((resolve, reject) => {\n  // Your code here\n  resolve(value);\n});'
  },
  python: {
    'Function': 'def example():\n    return "Hello World"',
    'Class': 'class Example:\n    def __init__(self, name):\n        self.name = name\n    \n    def greet(self):\n        return f"Hello, {self.name}"',
    'List Comprehension': '[x for x in range(10) if x % 2 == 0]',
    'Context Manager': 'with open("file.txt", "r") as f:\n    content = f.read()',
    'Decorator': '@decorator\ndef function():\n    pass'
  },
  html: {
    'Basic Structure': '<!DOCTYPE html>\n<html>\n<head>\n  <title>Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
    'Form': '<form>\n  <input type="text" name="name">\n  <button type="submit">Submit</button>\n</form>',
    'Link': '<a href="https://example.com">Link</a>',
    'Image': '<img src="image.jpg" alt="Description">',
    'List': '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>'
  },
  css: {
    'Flexbox': '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
    'Grid': '.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}',
    'Media Query': '@media (max-width: 768px) {\n  .container {\n    /* Mobile styles */\n  }\n}',
    'Animation': '@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}',
    'Transform': '.element {\n  transform: translateX(50px) rotate(45deg);\n}'
  }
};

export default function CodeSnippetGenerator() {
  const [language, setLanguage] = useState('javascript');
  const [snippetType, setSnippetType] = useState('');
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    if (!snippetType) {
      setOutput('');
      return;
    }
    setOutput(snippets[language]?.[snippetType] || 'Snippet not found');
  }, [language, snippetType]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Language</label>
          <select value={language} onChange={(e) => { setLanguage(e.target.value); setSnippetType(''); setOutput(''); }} className="input-base">
            {Object.keys(snippets).map(lang => (
              <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Snippet Type</label>
          <select value={snippetType} onChange={(e) => { setSnippetType(e.target.value); generate(); }} className="input-base">
            <option value="">Select snippet...</option>
            {Object.keys(snippets[language] || {}).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label={`${language.charAt(0).toUpperCase() + language.slice(1)} Snippet`}
          language={language}
          showLineNumbers
        />
      )}
    </ToolShell>
  );
}

