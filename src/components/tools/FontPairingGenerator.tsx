import { useState, useCallback } from 'react';
import { Copy, RotateCcw, Type } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const PAIRINGS = [
  {
    name: 'Modern Sans',
    heading: 'Inter',
    body: 'Inter',
    description: 'Clean and modern',
  },
  {
    name: 'Classic Serif',
    heading: 'Playfair Display',
    body: 'Lora',
    description: 'Elegant and readable',
  },
  {
    name: 'Bold Contrast',
    heading: 'Montserrat',
    body: 'Open Sans',
    description: 'Strong and clear',
  },
  {
    name: 'Minimal',
    heading: 'Poppins',
    body: 'Roboto',
    description: 'Simple and clean',
  },
  {
    name: 'Editorial',
    heading: 'Merriweather',
    body: 'Source Sans Pro',
    description: 'Professional and readable',
  },
  {
    name: 'Creative',
    heading: 'Oswald',
    body: 'Lato',
    description: 'Bold and friendly',
  },
];

export default function FontPairingGenerator() {
  const [selectedPairing, setSelectedPairing] = useState<typeof PAIRINGS[0] | null>(null);
  const [customHeading, setCustomHeading] = useState('');
  const [customBody, setCustomBody] = useState('');
  const { showToast } = useToast();

  const generateCSS = useCallback((heading: string, body: string) => {
    return `/* Font Pairing */
.heading {
  font-family: '${heading}', sans-serif;
  font-weight: 700;
}

.body {
  font-family: '${body}', sans-serif;
  font-weight: 400;
}`;
  }, []);

  const handleCopy = useCallback(() => {
    const heading = selectedPairing ? selectedPairing.heading : customHeading;
    const body = selectedPairing ? selectedPairing.body : customBody;
    if (!heading || !body) {
      showToast('Please select or enter fonts', 'error');
      return;
    }
    const css = generateCSS(heading, body);
    navigator.clipboard.writeText(css).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [selectedPairing, customHeading, customBody, generateCSS, showToast]);

  const pairing = selectedPairing || { heading: customHeading, body: customBody };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleCopy}
          className="btn-primary flex items-center gap-2"
        >
          <Copy size={18} />
          Copy CSS
        </button>
        <button
          onClick={() => {
            setSelectedPairing(null);
            setCustomHeading('');
            setCustomBody('');
          }}
          className="btn-ghost flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Preset Pairings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PAIRINGS.map((pairing) => (
              <button
                key={pairing.name}
                onClick={() => setSelectedPairing(pairing)}
                className="p-4 rounded-xl border text-left hover:border-blue-500 transition-colors"
                style={{
                  backgroundColor: selectedPairing?.name === pairing.name ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  borderColor: selectedPairing?.name === pairing.name ? 'var(--brand-primary)' : 'var(--border-primary)'
                }}
              >
                <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {pairing.name}
                </div>
                <div className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                  {pairing.description}
                </div>
                <div className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                  <div>H: {pairing.heading}</div>
                  <div>B: {pairing.body}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Custom Pairing
            </h4>
            <div className="space-y-3">
              <div>
                <label className="label text-xs">Heading Font</label>
                <input
                  type="text"
                  value={customHeading}
                  onChange={(e) => {
                    setCustomHeading(e.target.value);
                    setSelectedPairing(null);
                  }}
                  className="input w-full"
                  placeholder="e.g., Inter, Roboto, Montserrat"
                />
              </div>
              <div>
                <label className="label text-xs">Body Font</label>
                <input
                  type="text"
                  value={customBody}
                  onChange={(e) => {
                    setCustomBody(e.target.value);
                    setSelectedPairing(null);
                  }}
                  className="input w-full"
                  placeholder="e.g., Inter, Open Sans, Lato"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Type size={20} />
            Preview
          </h3>
          <div className="p-8 rounded-xl border space-y-6" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            minHeight: '400px'
          }}>
            <div>
              <h1
                className="text-4xl font-bold mb-2"
                style={{
                  fontFamily: pairing.heading ? `'${pairing.heading}', sans-serif` : 'inherit',
                  color: 'var(--text-primary)'
                }}
              >
                Heading Font
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {pairing.heading || 'Select a font'}
              </p>
            </div>
            <div>
              <p
                className="text-lg leading-relaxed"
                style={{
                  fontFamily: pairing.body ? `'${pairing.body}', sans-serif` : 'inherit',
                  color: 'var(--text-primary)'
                }}
              >
                This is the body text. It should be readable and comfortable for longer reading. 
                The font pairing creates visual hierarchy and improves the overall design aesthetic.
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                {pairing.body || 'Select a font'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {(selectedPairing || (customHeading && customBody)) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Generated CSS
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <pre className="text-sm overflow-x-auto" style={{ color: 'var(--text-primary)' }}>
              <code>{generateCSS(pairing.heading, pairing.body)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

