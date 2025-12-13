import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident'
];

export default function LoremIpsum() {
  const [output, setOutput] = useState('');
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [count, setCount] = useState(3);

  const generateWords = useCallback((num: number) => {
    const words: string[] = [];
    for (let i = 0; i < num; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(' ');
  }, []);

  const generateSentence = useCallback(() => {
    const wordCount = Math.floor(Math.random() * 10) + 5;
    const words = generateWords(wordCount);
    return words.charAt(0).toUpperCase() + words.slice(1) + '.';
  }, [generateWords]);

  const generateParagraph = useCallback(() => {
    const sentenceCount = Math.floor(Math.random() * 3) + 3;
    const sentences: string[] = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  }, [generateSentence]);

  const generate = useCallback(() => {
    let result = '';
    
    if (type === 'words') {
      result = generateWords(count);
    } else if (type === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      result = sentences.join(' ');
    } else {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      result = paragraphs.join('\n\n');
    }
    
    setOutput(result);
  }, [type, count, generateWords, generateSentence, generateParagraph]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="label-inline">Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="input-base">
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
            <option value="paragraphs">Paragraphs</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="label-inline">Count:</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max="100"
            className="input-base w-24"
          />
        </div>
        <button onClick={generate} className="btn-primary">
          Generate
        </button>
        <button onClick={() => setOutput('')} className="btn-ghost">
          Clear
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="Generated Text"
          language="text"
        />
      )}
    </div>
  );
}

