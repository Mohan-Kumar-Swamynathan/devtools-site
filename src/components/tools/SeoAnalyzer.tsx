import { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle, ExternalLink, Copy } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface SeoIssue {
    type: 'error' | 'warning' | 'success';
    category: string;
    message: string;
    fix?: string;
}

export default function SeoAnalyzer() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [issues, setIssues] = useState<SeoIssue[]>([]);
    const [score, setScore] = useState<number | null>(null);
    const { showToast } = useToast();

    const analyzeUrl = async () => {
        if (!url) {
            showToast('Please enter a URL', 'error');
            return;
        }

        setLoading(true);
        setIssues([]);
        setScore(null);

        try {
            // Fetch the HTML content
            const response = await fetch(url);
            const html = await response.text();

            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const foundIssues: SeoIssue[] = [];
            let totalScore = 100;

            // Check title tag
            const title = doc.querySelector('title');
            if (!title || !title.textContent) {
                foundIssues.push({
                    type: 'error',
                    category: 'Title',
                    message: 'Missing title tag',
                    fix: 'Add a <title> tag in the <head> section'
                });
                totalScore -= 15;
            } else if (title.textContent.length < 30) {
                foundIssues.push({
                    type: 'warning',
                    category: 'Title',
                    message: `Title too short (${title.textContent.length} chars). Recommended: 50-60 characters`,
                    fix: 'Expand your title to include relevant keywords'
                });
                totalScore -= 5;
            } else if (title.textContent.length > 60) {
                foundIssues.push({
                    type: 'warning',
                    category: 'Title',
                    message: `Title too long (${title.textContent.length} chars). May be truncated in search results`,
                    fix: 'Shorten your title to 50-60 characters'
                });
                totalScore -= 3;
            } else {
                foundIssues.push({
                    type: 'success',
                    category: 'Title',
                    message: `Title length optimal (${title.textContent.length} chars)`
                });
            }

            // Check meta description
            const description = doc.querySelector('meta[name="description"]');
            if (!description || !description.getAttribute('content')) {
                foundIssues.push({
                    type: 'error',
                    category: 'Meta Description',
                    message: 'Missing meta description',
                    fix: 'Add <meta name="description" content="...">'
                });
                totalScore -= 15;
            } else {
                const descLength = description.getAttribute('content')!.length;
                if (descLength < 120) {
                    foundIssues.push({
                        type: 'warning',
                        category: 'Meta Description',
                        message: `Description too short (${descLength} chars). Recommended: 150-160 characters`,
                        fix: 'Expand your description with more details'
                    });
                    totalScore -= 5;
                } else if (descLength > 160) {
                    foundIssues.push({
                        type: 'warning',
                        category: 'Meta Description',
                        message: `Description too long (${descLength} chars). May be truncated`,
                        fix: 'Shorten to 150-160 characters'
                    });
                    totalScore -= 3;
                } else {
                    foundIssues.push({
                        type: 'success',
                        category: 'Meta Description',
                        message: `Description length optimal (${descLength} chars)`
                    });
                }
            }

            // Check H1 tags
            const h1Tags = doc.querySelectorAll('h1');
            if (h1Tags.length === 0) {
                foundIssues.push({
                    type: 'error',
                    category: 'Headings',
                    message: 'No H1 tag found',
                    fix: 'Add one H1 tag with your main keyword'
                });
                totalScore -= 10;
            } else if (h1Tags.length > 1) {
                foundIssues.push({
                    type: 'warning',
                    category: 'Headings',
                    message: `Multiple H1 tags found (${h1Tags.length}). Use only one H1 per page`,
                    fix: 'Convert additional H1s to H2 or H3'
                });
                totalScore -= 5;
            } else {
                foundIssues.push({
                    type: 'success',
                    category: 'Headings',
                    message: 'One H1 tag found (optimal)'
                });
            }

            // Check Open Graph tags
            const ogTitle = doc.querySelector('meta[property="og:title"]');
            const ogDescription = doc.querySelector('meta[property="og:description"]');
            const ogImage = doc.querySelector('meta[property="og:image"]');

            if (!ogTitle || !ogDescription || !ogImage) {
                foundIssues.push({
                    type: 'warning',
                    category: 'Open Graph',
                    message: 'Incomplete Open Graph tags',
                    fix: 'Add og:title, og:description, and og:image meta tags'
                });
                totalScore -= 8;
            } else {
                foundIssues.push({
                    type: 'success',
                    category: 'Open Graph',
                    message: 'Open Graph tags present'
                });
            }

            // Check Twitter Card tags
            const twitterCard = doc.querySelector('meta[name="twitter:card"]');
            const twitterTitle = doc.querySelector('meta[name="twitter:title"]');

            if (!twitterCard || !twitterTitle) {
                foundIssues.push({
                    type: 'warning',
                    category: 'Twitter Card',
                    message: 'Missing Twitter Card tags',
                    fix: 'Add twitter:card and twitter:title meta tags'
                });
                totalScore -= 5;
            } else {
                foundIssues.push({
                    type: 'success',
                    category: 'Twitter Card',
                    message: 'Twitter Card tags present'
                });
            }

            // Check canonical URL
            const canonical = doc.querySelector('link[rel="canonical"]');
            if (!canonical) {
                foundIssues.push({
                    type: 'warning',
                    category: 'Canonical URL',
                    message: 'No canonical URL specified',
                    fix: 'Add <link rel="canonical" href="...">'
                });
                totalScore -= 5;
            } else {
                foundIssues.push({
                    type: 'success',
                    category: 'Canonical URL',
                    message: 'Canonical URL present'
                });
            }

            // Check for structured data (JSON-LD)
            const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
            if (jsonLdScripts.length === 0) {
                foundIssues.push({
                    type: 'warning',
                    category: 'Structured Data',
                    message: 'No structured data (JSON-LD) found',
                    fix: 'Add schema.org structured data for better search visibility'
                });
                totalScore -= 10;
            } else {
                foundIssues.push({
                    type: 'success',
                    category: 'Structured Data',
                    message: `${jsonLdScripts.length} structured data block(s) found`
                });
            }

            // Check images for alt text
            const images = doc.querySelectorAll('img');
            const imagesWithoutAlt = Array.from(images).filter(img => !img.hasAttribute('alt'));
            if (imagesWithoutAlt.length > 0) {
                foundIssues.push({
                    type: 'warning',
                    category: 'Images',
                    message: `${imagesWithoutAlt.length} image(s) missing alt text`,
                    fix: 'Add descriptive alt attributes to all images'
                });
                totalScore -= Math.min(10, imagesWithoutAlt.length * 2);
            } else if (images.length > 0) {
                foundIssues.push({
                    type: 'success',
                    category: 'Images',
                    message: 'All images have alt text'
                });
            }

            setIssues(foundIssues);
            setScore(Math.max(0, totalScore));
            showToast('Analysis complete', 'success');
        } catch (error) {
            showToast('Failed to analyze URL. Make sure CORS is enabled or use a proxy.', 'error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'var(--color-success)';
        if (score >= 60) return 'var(--color-warning)';
        return 'var(--color-error)';
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />;
            case 'warning':
                return <AlertCircle size={20} style={{ color: 'var(--color-warning)' }} />;
            case 'error':
                return <XCircle size={20} style={{ color: 'var(--color-error)' }} />;
            default:
                return null;
        }
    };

    const controls = (
        <div className="flex items-center gap-3">
            <button
                onClick={analyzeUrl}
                disabled={loading || !url}
                className="btn-primary px-4 py-2 flex items-center gap-2"
            >
                <Search size={16} />
                {loading ? 'Analyzing...' : 'Analyze'}
            </button>
        </div>
    );

    return (
        <ToolShell
            title="SEO Analyzer"
            description="Analyze your website's SEO and get actionable recommendations"
            controls={controls}
        >
            <div className="space-y-6">
                {/* URL Input */}
                <div>
                    <label className="label">Website URL</label>
                    <div className="relative">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="input-base w-full"
                            onKeyDown={(e) => e.key === 'Enter' && analyzeUrl()}
                        />
                        <ExternalLink
                            size={18}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            style={{ color: 'var(--text-muted)' }}
                        />
                    </div>
                </div>

                {/* SEO Score */}
                {score !== null && (
                    <div className="card p-6 text-center animate-fade-in">
                        <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                            SEO Score
                        </div>
                        <div
                            className="text-6xl font-bold mb-2"
                            style={{ color: getScoreColor(score) }}
                        >
                            {score}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
                        </div>
                    </div>
                )}

                {/* Issues List */}
                {issues.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Analysis Results
                        </h3>
                        {issues.map((issue, index) => (
                            <div
                                key={index}
                                className="card p-4 flex gap-3 animate-slide-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex-shrink-0 mt-0.5">
                                    {getIconForType(issue.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                                            {issue.category}
                                        </span>
                                    </div>
                                    <p className="text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                                        {issue.message}
                                    </p>
                                    {issue.fix && (
                                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                            💡 {issue.fix}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {issues.length === 0 && !loading && (
                    <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                        <Search size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Enter a URL above to analyze its SEO</p>
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
