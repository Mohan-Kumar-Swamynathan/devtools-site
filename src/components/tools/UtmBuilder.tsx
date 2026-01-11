import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, RefreshCw, ExternalLink } from 'lucide-react';
import ToolShell from './ToolShell';

export default function UtmBuilder() {
    const [url, setUrl] = useState('');
    const [source, setSource] = useState('');
    const [medium, setMedium] = useState('');
    const [campaign, setCampaign] = useState('');
    const [term, setTerm] = useState('');
    const [content, setContent] = useState('');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!url) {
            setResult('');
            return;
        }

        try {
            const buildUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
            if (source) buildUrl.searchParams.set('utm_source', source);
            if (medium) buildUrl.searchParams.set('utm_medium', medium);
            if (campaign) buildUrl.searchParams.set('utm_campaign', campaign);
            if (term) buildUrl.searchParams.set('utm_term', term);
            if (content) buildUrl.searchParams.set('utm_content', content);

            setResult(buildUrl.toString());
        } catch (e) {
            // Invalid URL, just wait
        }
    }, [url, source, medium, campaign, term, content]);

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearAll = () => {
        setUrl('');
        setSource('');
        setMedium('');
        setCampaign('');
        setTerm('');
        setContent('');
    };

    return (
        <ToolShell
            title="UTM Campaign URL Builder"
            description="Generate tracking URLs for Google Analytics and marketing campaigns"
            icon={<Link2 className="w-6 h-6" />}
        >
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                            Website URL <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
                        />
                        <p className="mt-1 text-xs text-[var(--text-muted)]">The full website URL (e.g. https://www.example.com)</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                Campaign Source <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                placeholder="google, newsletter"
                                className="w-full px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                Campaign Medium <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={medium}
                                onChange={(e) => setMedium(e.target.value)}
                                placeholder="cpc, email, banner"
                                className="w-full px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                            Campaign Name
                        </label>
                        <input
                            type="text"
                            value={campaign}
                            onChange={(e) => setCampaign(e.target.value)}
                            placeholder="summer_sale, promo_code"
                            className="w-full px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                Campaign Term
                            </label>
                            <input
                                type="text"
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                                placeholder="running+shoes"
                                className="w-full px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                Campaign Content
                            </label>
                            <input
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="logolink, textlink"
                                className="w-full px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={clearAll}
                        className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <RefreshCw size={14} /> Clear form
                    </button>
                </div>

                {/* Result */}
                <div className="space-y-6">
                    <div className="sticky top-24 p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] shadow-lg">
                        <h3 className="font-semibold text-lg mb-4 text-[var(--text-primary)]">Generated URL</h3>

                        {result ? (
                            <>
                                <div className="p-4 bg-[var(--bg-secondary)] rounded-xl break-all text-sm text-[var(--text-primary)] font-mono border border-[var(--border-primary)] mb-4">
                                    {result}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                        {copied ? 'Copied!' : 'Copy URL'}
                                    </button>
                                    <a
                                        href={result}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 btn btn-outline flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink size={18} />
                                        Test URL
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 text-[var(--text-muted)] text-sm">
                                Fill in the form to generate a UTM tracking URL.
                            </div>
                        )}
                    </div>

                    <div className="bg-[var(--bg-secondary)]/50 p-4 rounded-xl border border-[var(--border-primary)]">
                        <h4 className="font-medium text-sm mb-2 text-[var(--text-primary)]">Quick Tips</h4>
                        <ul className="text-xs text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                            <li><strong>Source:</strong> The referrer (e.g. google, newsletter, linkedin)</li>
                            <li><strong>Medium:</strong> Marketing medium (e.g. cpc, banner, email)</li>
                            <li><strong>Campaign:</strong> Product, promo code, or slogan (e.g. spring_sale)</li>
                            <li>Use lowercase to avoid duplicate data in Analytics.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
