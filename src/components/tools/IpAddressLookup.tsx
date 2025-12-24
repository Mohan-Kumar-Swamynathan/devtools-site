import { useState, useCallback } from 'react';
import { Search, Globe, MapPin, Server, Loader } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface IPInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  org?: string;
  asn?: string;
  isp?: string;
}

export default function IpAddressLookup() {
  const [ip, setIp] = useState('');
  const [info, setInfo] = useState<IPInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [myIp, setMyIp] = useState<string | null>(null);

  const fetchMyIP = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setMyIp(data.ip);
      setIp(data.ip);
    } catch (e) {
      setError('Failed to fetch your IP address');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const lookupIP = useCallback(async (ipAddress: string) => {
    setIsLoading(true);
    setError('');
    setInfo(null);

    try {
      // Use ipapi.co free API (no key required for basic lookup)
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch IP information');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Invalid IP address');
      }

      setInfo({
        ip: data.ip || ipAddress,
        city: data.city,
        region: data.region,
        country: data.country_name,
        country_code: data.country_code,
        postal: data.postal,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        org: data.org,
        asn: data.asn,
        isp: data.org
      });
    } catch (e: any) {
      setError(e.message || 'Failed to lookup IP address. Please try again.');
      setInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLookup = useCallback(() => {
    if (!ip.trim()) {
      setError('Please enter an IP address');
      return;
    }

    // Basic IP validation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ip.trim())) {
      setError('Please enter a valid IP address (e.g., 8.8.8.8)');
      return;
    }

    lookupIP(ip.trim());
  }, [ip, lookupIP]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="space-y-4">
        <div>
          <label className="label">IP Address</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
              className="input-base flex-1"
              placeholder="8.8.8.8 or leave empty for your IP"
            />
            <button
              onClick={handleLookup}
              disabled={isLoading || !ip.trim()}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Search size={18} />
                  Lookup
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={fetchMyIP}
          disabled={isLoading}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <Globe size={18} />
          Get My IP Address
        </button>
      </div>

      {info && (
        <div className="space-y-4 animate-fade-in-scale">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border" style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--border-primary)' 
            }}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={20} style={{ color: 'var(--brand-primary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Location
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                {info.city && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>City:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{info.city}</span>
                  </div>
                )}
                {info.region && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Region:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{info.region}</span>
                  </div>
                )}
                {info.country && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Country:</span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {info.country} {info.country_code && `(${info.country_code})`}
                    </span>
                  </div>
                )}
                {info.postal && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Postal Code:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{info.postal}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl border" style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--border-primary)' 
            }}>
              <div className="flex items-center gap-2 mb-3">
                <Server size={20} style={{ color: 'var(--brand-primary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Network
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>IP Address:</span>
                  <code className="font-mono" style={{ color: 'var(--text-primary)' }}>{info.ip}</code>
                </div>
                {info.org && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Organization:</span>
                    <span className="truncate ml-2" style={{ color: 'var(--text-primary)' }}>{info.org}</span>
                  </div>
                )}
                {info.asn && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>ASN:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{info.asn}</span>
                  </div>
                )}
                {info.isp && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>ISP:</span>
                    <span className="truncate ml-2" style={{ color: 'var(--text-primary)' }}>{info.isp}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {(info.latitude && info.longitude) && (
            <div className="p-4 rounded-xl border" style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--border-primary)' 
            }}>
              <div className="flex items-center gap-2 mb-3">
                <Globe size={20} style={{ color: 'var(--brand-primary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Coordinates
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Latitude:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{info.latitude}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Longitude:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{info.longitude}</span>
                </div>
                {info.timezone && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Timezone:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{info.timezone}</span>
                  </div>
                )}
                <a
                  href={`https://www.google.com/maps?q=${info.latitude},${info.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary btn-sm mt-2 inline-block"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          )}

          <OutputPanel
            value={JSON.stringify(info, null, 2)}
            label="Raw JSON Data"
            language="json"
            showLineNumbers
          />
        </div>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-primary)' 
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          About IP Lookup:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• Uses ipapi.co free API (no API key required)</li>
          <li>• Shows location, network, and ISP information</li>
          <li>• Limited to 1,000 requests per day (free tier)</li>
          <li>• Your IP address is used for API requests</li>
        </ul>
      </div>
    </ToolShell>
  );
}

