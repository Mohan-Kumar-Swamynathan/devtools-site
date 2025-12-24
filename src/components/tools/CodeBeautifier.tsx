import { useState } from 'react';
import { Sparkles, Copy } from 'lucide-react';
import ToolShell from './ToolShell';
import CodeEditor from '../common/CodeEditor';
import { useToast } from '@/hooks/useToast';

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'json', label: 'JSON' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'xml', label: 'XML' }
];

export default function CodeBeautifier() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [indentSize, setIndentSize] = useState(2);
    const { showToast } = useToast();

    const beautify = () => {
        try {
            let beautified = '';

            switch (language) {
                case 'json':
                    const parsed = JSON.parse(input);
                    beautified = JSON.stringify(parsed, null, indentSize);
                    break;

                case 'javascript':
                case 'typescript':
                    // Simple beautification for JS/TS
                    beautified = beautifyJavaScript(input, indentSize);
                    break;

                case 'html':
                case 'xml':
                    beautified = beautifyHTML(input, indentSize);
                    break;

                case 'css':
                    beautified = beautifyCSS(input, indentSize);
                    break;

                case 'sql':
                    beautified = beautifySQL(input, indentSize);
                    break;

                default:
                    beautified = input;
            }

            setOutput(beautified);
            showToast('Code beautified successfully', 'success');
        } catch (error) {
            showToast(`Error: ${(error as Error).message}`, 'error');
        }
    };

    const beautifyJavaScript = (code: string, indent: number): string => {
        const indentStr = ' '.repeat(indent);
        let level = 0;
        let result = '';
        let inString = false;
        let stringChar = '';

        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const prev = code[i - 1];

            if ((char === '"' || char === "'" || char === '`') && prev !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                }
            }

            if (!inString) {
                if (char === '{' || char === '[') {
                    result += char + '\n' + indentStr.repeat(++level);
                } else if (char === '}' || char === ']') {
                    result += '\n' + indentStr.repeat(--level) + char;
                } else if (char === ';') {
                    result += char + '\n' + indentStr.repeat(level);
                } else if (char === ',') {
                    result += char + '\n' + indentStr.repeat(level);
                } else if (char !== '\n' && char !== '\r') {
                    result += char;
                }
            } else {
                result += char;
            }
        }

        return result.trim();
    };

    const beautifyHTML = (code: string, indent: number): string => {
        const indentStr = ' '.repeat(indent);
        let level = 0;
        let result = '';
        const tags = code.match(/<[^>]+>/g) || [];
        let lastIndex = 0;

        tags.forEach(tag => {
            const index = code.indexOf(tag, lastIndex);
            const textBefore = code.substring(lastIndex, index).trim();

            if (textBefore) {
                result += indentStr.repeat(level) + textBefore + '\n';
            }

            if (tag.startsWith('</')) {
                level = Math.max(0, level - 1);
                result += indentStr.repeat(level) + tag + '\n';
            } else if (tag.endsWith('/>')) {
                result += indentStr.repeat(level) + tag + '\n';
            } else {
                result += indentStr.repeat(level) + tag + '\n';
                level++;
            }

            lastIndex = index + tag.length;
        });

        return result.trim();
    };

    const beautifyCSS = (code: string, indent: number): string => {
        const indentStr = ' '.repeat(indent);
        return code
            .replace(/\s*{\s*/g, ' {\n' + indentStr)
            .replace(/\s*}\s*/g, '\n}\n')
            .replace(/\s*;\s*/g, ';\n' + indentStr)
            .replace(/\n\s*\n/g, '\n')
            .trim();
    };

    const beautifySQL = (code: string, indent: number): string => {
        const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT'];
        const indentStr = ' '.repeat(indent);
        let result = code;

        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            result = result.replace(regex, '\n' + keyword);
        });

        return result.trim();
    };

    const loadExample = () => {
        const examples: Record<string, string> = {
            javascript: 'function hello(name){return `Hello, ${name}!`;}const result=hello("World");console.log(result);',
            json: '{"name":"John","age":30,"city":"New York","hobbies":["reading","coding"]}',
            html: '<div><h1>Title</h1><p>Paragraph</p><ul><li>Item 1</li><li>Item 2</li></ul></div>',
            css: 'body{margin:0;padding:0;}.container{max-width:1200px;margin:0 auto;}',
            sql: 'SELECT id,name,email FROM users WHERE age>18 ORDER BY name LIMIT 10;'
        };
        setInput(examples[language] || '');
    };

    const controls = (
        <div className="flex items-center gap-3 flex-wrap">
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-base px-3 py-2"
            >
                {LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
            </select>

            <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="input-base px-3 py-2"
            >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
            </select>

            <button
                onClick={loadExample}
                className="btn-secondary px-4 py-2"
            >
                Load Example
            </button>

            <button
                onClick={beautify}
                disabled={!input}
                className="btn-primary px-4 py-2 flex items-center gap-2"
            >
                <Sparkles size={16} />
                Beautify
            </button>
        </div>
    );

    return (
        <ToolShell
            title="Code Beautifier"
            description="Format and beautify code in multiple languages"
            controls={controls}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <CodeEditor
                        value={input}
                        onChange={setInput}
                        language={language}
                        placeholder={`Paste your ${language} code here...`}
                        label="Input Code"
                        showLineNumbers
                    />
                </div>

                <div>
                    <CodeEditor
                        value={output}
                        onChange={() => { }}
                        language={language}
                        placeholder="Beautified code will appear here..."
                        label="Beautified Code"
                        readOnly
                        showLineNumbers
                    />
                </div>
            </div>
        </ToolShell>
    );
}
