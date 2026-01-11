import React, { useState } from 'react';
import { Search, Globe, Server, Shield, Mail, FileText, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

type RecordType = 'A' | 'AAAA' | 'MX' | 'NS' | 'CNAME' | 'TXT' | 'SOA';

const RECORD_TYPES: { type: RecordType; name: string; description: string }[] = [
    { type: 'A', name: 'A Record', description: 'Points a domain to an IPv4 address' },
    { type: 'AAAA', name: 'AAAA Record', description: 'Points a domain to an IPv6 address' },
    { type: 'MX', name: 'MX Record', description: 'Mail exchange servers' },
    { type: 'NS', name: 'NS Record', description: 'Authoritative name servers' },
    { type: 'CNAME', name: 'CNAME', description: 'Canonical name (alias)' },
    { type: 'TXT', name: 'TXT Record', description: 'Text records (SPF, verification)' },
    { type: 'SOA', name: 'SOA Record', description: 'Start of Authority' },
];

interface DnsRecord {
    name: string;
    type: number;
    TTL: number;
    data: string;
}

export default function DnsLookup() {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Record<string, DnsRecord[]>>({});
    const [searchedDomain, setSearchedDomain] = useState('');
    const { toast } = useToast();

    const performLookup = async () => {
        if (!domain) return;

        // Basic validation
        const cleanDomain = domain.replace(/https?:\/\//, '').replace(/\/.*$/, '');
        if (!cleanDomain.includes('.')) {
            toast({ title: 'Invalid Domain', description: 'Please enter a valid domain name.', variant: 'error' });
            return;
        }

        setLoading(true);
        setSearchedDomain(cleanDomain);
        setResults({});

        const newResults: Record<string, DnsRecord[]> = {};

        try {
            // Fetch all record types in parallel using Cloudflare DoH
            // Cloudflare DoH: https://cloudflare-dns.com/dns-query

            const fetchType = async (type: string) => {
                try {
                    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=${type}`, {
                        headers: { 'Accept': 'application/dns-json' }
                    });
                    const data = await response.json();
                    if (data.Answer) {
                        newResults[type] = data.Answer;
                    }
                } catch (e) {
                    console.error(`Failed to fetch ${type}`, e);
                }
            };

            await Promise.all(RECORD_TYPES.map(r => fetchType(r.type)));

            setResults(newResults);

            if (Object.keys(newResults).length === 0) {
                toast({ title: 'No Records Found', description: 'Could not find any DNS records for this domain.', variant: 'error' });
            }

        } catch (err) {
            toast({ title: 'Error', description: 'Failed to perform DNS lookup.', variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ToolShell
            title="DNS Lookup Tool"
            description="Check DNS records (A, MX, NS, TXT) for any domain"
            icon={<Globe className="w-6 h-6" />}
        >
            <div className="space-y-8">
                {/* Search */}
                <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] shadow-sm">
                    <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                        Domain Name
                    </label>
                    <div className="flex gap-3">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-[var(--text-muted)]" />
                            </div>
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && performLookup()}
                                placeholder="example.com"
                                className="block w-full pl-10 pr-3 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all outline-none"
                            />
                        </div>
                        <button
                            onClick={performLookup}
                            disabled={!domain || loading}
                            className={clsx(
                                "px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl active:scale-95",
                                domain && !loading
                                    ? "bg-[var(--brand-primary)]"
                                    : "bg-gray-600 cursor-not-allowed opacity-50"
                            )}
                        >
                            {loading ? 'Searching...' : 'Lookup'}
                        </button>
                    </div>
                </div>

                {/* Results */}
                {searchedDomain && !loading && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-[var(--text-primary)]">DNS Records for {searchedDomain}</h3>
                        </div>

                        {Object.keys(results).length === 0 ? (
                            <div className="text-center p-12 text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-2xl">
                                No records found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {RECORD_TYPES.filter(t => results[t.type]).map(type => (
                                    <div key={type.type} className="p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-2.5 py-1 rounded bg-[var(--brand-primary)] text-white text-xs font-bold w-12 text-center">
                                                {type.type}
                                            </span>
                                            <span className="text-sm font-medium text-[var(--text-secondary)]">{type.description}</span>
                                        </div>

                                        <div className="space-y-3">
                                            {results[type.type].map((record, idx) => (
                                                <div key={idx} className="p-3 rounded-lg bg-[var(--bg-input)] font-mono text-sm break-all text-[var(--text-primary)] border border-[var(--border-input)]">
                                                    {record.data}
                                                    <div className="text-xs text-[var(--text-muted)] mt-1 flex justify-between">
                                                        <span>TTL: {record.TTL}s</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
