import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

interface SpecificityResult {
  selector: string;
  specificity: [number, number, number, number];
  score: number;
  breakdown: string;
}

function calculateSpecificity(selector: string): SpecificityResult {
  // Remove pseudo-elements (::before, ::after, etc.)
  selector = selector.replace(/::[\w-]+/g, '');
  
  // Count IDs
  const idCount = (selector.match(/#[\w-]+/g) || []).length;
  
  // Count classes, attributes, and pseudo-classes
  const classCount = (selector.match(/\.[\w-]+/g) || []).length;
  const attrCount = (selector.match(/\[[\w-]+/g) || []).length;
  const pseudoClassCount = (selector.match(/:(?:not|is|where|has|[\w-]+)\(/g) || []).length + 
                            (selector.match(/:(?:hover|focus|active|visited|link|first-child|last-child|nth-child|nth-of-type|before|after|first-line|first-letter)/g) || []).length;
  
  const classAttrPseudo = classCount + attrCount + pseudoClassCount;
  
  // Count elements and pseudo-elements
  const elementCount = (selector.match(/(?:^|[^#.\[])[a-zA-Z][\w-]*/g) || []).length;
  
  const specificity: [number, number, number, number] = [
    idCount,
    classAttrPseudo,
    elementCount,
    0
  ];
  
  const score = idCount * 1000 + classAttrPseudo * 100 + elementCount;
  
  const breakdown = [
    `${idCount} ID${idCount !== 1 ? 's' : ''}`,
    `${classAttrPseudo} class/attribute/pseudo-class${classAttrPseudo !== 1 ? 'es' : ''}`,
    `${elementCount} element${elementCount !== 1 ? 's' : ''}`
  ].join(', ');
  
  return {
    selector,
    specificity,
    score,
    breakdown
  };
}

export default function CssSpecificityCalculator() {
  const [selectors, setSelectors] = useState('div.container\n#header .nav-item\na:hover');
  const [results, setResults] = useState<SpecificityResult[]>([]);
  const [output, setOutput] = useState('');

  const calculate = useCallback(() => {
    const selectorList = selectors.split('\n').filter(s => s.trim());
    const calculated = selectorList.map(s => calculateSpecificity(s.trim()));
    
    // Sort by specificity (highest first)
    calculated.sort((a, b) => {
      for (let i = 0; i < 4; i++) {
        if (a.specificity[i] !== b.specificity[i]) {
          return b.specificity[i] - a.specificity[i];
        }
      }
      return 0;
    });
    
    setResults(calculated);
    
    const outputText = calculated
      .map(r => `${r.selector}\n  Specificity: ${r.specificity.join('-')} (${r.score})\n  Breakdown: ${r.breakdown}`)
      .join('\n\n');
    
    setOutput(outputText);
  }, [selectors]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={selectors}
        onChange={setSelectors}
        language="css"
        label="CSS Selectors (one per line)"
        placeholder="div.container&#10;#header .nav-item&#10;a:hover"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={calculate} className="btn-primary">
          Calculate Specificity
        </button>
        <button onClick={() => { setSelectors(''); setResults([]); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)'
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <code className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                  {result.selector}
                </code>
                <span
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--brand-primary-light)',
                    color: 'var(--brand-primary)'
                  }}
                >
                  {result.specificity.join('-')}
                </span>
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <p>Score: <strong>{result.score}</strong></p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {result.breakdown}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {output && (
        <OutputPanel
          value={output}
          label="Specificity Results"
          language="text"
          showLineNumbers
        />
      )}

      <div className="p-4 rounded-xl border text-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          How Specificity Works:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• <strong>IDs:</strong> 1000 points each</li>
          <li>• <strong>Classes/Attributes/Pseudo-classes:</strong> 100 points each</li>
          <li>• <strong>Elements:</strong> 10 points each</li>
          <li>• Higher specificity wins when selectors conflict</li>
        </ul>
      </div>
    </div>
  );
}

