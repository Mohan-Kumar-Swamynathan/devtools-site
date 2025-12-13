import { useState, useCallback } from 'react';
import { Search, Info } from 'lucide-react';

const FEATURES = [
  { name: 'CSS Grid', support: { chrome: '57+', firefox: '52+', safari: '10.1+', edge: '16+' } },
  { name: 'Flexbox', support: { chrome: '29+', firefox: '28+', safari: '9+', edge: '12+' } },
  { name: 'CSS Variables', support: { chrome: '49+', firefox: '31+', safari: '9.1+', edge: '15+' } },
  { name: 'Backdrop Filter', support: { chrome: '76+', firefox: '103+', safari: '9+', edge: '79+' } },
  { name: 'Clip Path', support: { chrome: '23+', firefox: '3.5+', safari: '7+', edge: '12+' } },
  { name: 'Transform', support: { chrome: '36+', firefox: '16+', safari: '9+', edge: '12+' } },
  { name: 'Animation', support: { chrome: '43+', firefox: '16+', safari: '9+', edge: '12+' } },
  { name: 'Fetch API', support: { chrome: '42+', firefox: '39+', safari: '10.1+', edge: '14+' } },
  { name: 'Async/Await', support: { chrome: '55+', firefox: '52+', safari: '10.1+', edge: '15+' } },
  { name: 'Arrow Functions', support: { chrome: '45+', firefox: '22+', safari: '10+', edge: '12+' } },
];

export default function BrowserCompatibility() {
  const [search, setSearch] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<typeof FEATURES[0] | null>(null);

  const filteredFeatures = FEATURES.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="label">Search Features</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full pl-10"
              placeholder="Search CSS/JS features..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredFeatures.map((feature) => (
            <button
              key={feature.name}
              onClick={() => setSelectedFeature(feature)}
              className="p-4 rounded-xl border text-left hover:border-blue-500 transition-colors"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: selectedFeature?.name === feature.name ? 'var(--brand-primary)' : 'var(--border-primary)'
              }}
            >
              <div className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {feature.name}
              </div>
              <div className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                <div>Chrome: {feature.support.chrome}</div>
                <div>Firefox: {feature.support.firefox}</div>
                <div>Safari: {feature.support.safari}</div>
                <div>Edge: {feature.support.edge}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedFeature && (
        <div className="p-6 rounded-xl border" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Info size={24} />
            {selectedFeature.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border" style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Chrome
              </div>
              <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {selectedFeature.support.chrome}
              </div>
            </div>
            <div className="p-4 rounded-lg border" style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Firefox
              </div>
              <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {selectedFeature.support.firefox}
              </div>
            </div>
            <div className="p-4 rounded-lg border" style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Safari
              </div>
              <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {selectedFeature.support.safari}
              </div>
            </div>
            <div className="p-4 rounded-lg border" style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Edge
              </div>
              <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {selectedFeature.support.edge}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

