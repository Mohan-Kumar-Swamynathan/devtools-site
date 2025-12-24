
import { useState } from 'react';
import ToolShell from './ToolShell';
import CodeEditor from '@/components/common/CodeEditor';

export default function JwtDebugger() {
    const [token, setToken] = useState('');
    const [header, setHeader] = useState('');
    const [payload, setPayload] = useState('');
    const [signature, setSignature] = useState('');
    const [error, setError] = useState('');

    const decodeJwt = (jwt: string) => {
        setToken(jwt);
        setError('');

        if (!jwt) {
            setHeader('');
            setPayload('');
            setSignature('');
            return;
        }

        const parts = jwt.split('.');

        if (parts.length !== 3) {
            // Don't error immediately on typing, but clear invalid state
            if (jwt.length > 10) setError('Invalid JWT format (must have 3 parts)');
            return;
        }

        try {
            const decodedHeader = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
            const decodedPayload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));

            setHeader(JSON.stringify(JSON.parse(decodedHeader), null, 2));
            setPayload(JSON.stringify(JSON.parse(decodedPayload), null, 2));
            setSignature(parts[2]);
        } catch (e) {
            setError('Failed to decode JWT parts');
        }
    };

    const controls = (
        <div className="flex items-center gap-2">
            <button
                onClick={() => decodeJwt('')}
                className="btn-ghost"
            >
                Clear
            </button>
        </div>
    );

    return (
        <ToolShell
            title="JWT Debugger"
            description="Decode and inspect JSON Web Tokens"
            controls={controls}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <div className="space-y-4">
                    <CodeEditor
                        label="Encoded Token"
                        value={token}
                        onChange={decodeJwt}
                        placeholder="Paste JWT here (ey...)"
                        className="h-[500px]"
                    />
                    {error && <p className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>}
                </div>

                <div className="space-y-4">
                    <div className="grid grid-rows-3 gap-4 h-[500px]">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Header</label>
                            <pre className="input-base h-full overflow-auto text-sm font-mono p-4 rounded-xl" style={{ color: 'var(--syntax-function)' }}>
                                {header || '// Header'}
                            </pre>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Payload</label>
                            <pre className="input-base h-full overflow-auto text-sm font-mono p-4 rounded-xl" style={{ color: 'var(--syntax-keyword)' }}>
                                {payload || '// Payload'}
                            </pre>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Signature</label>
                            <pre className="input-base h-full overflow-auto text-sm font-mono p-4 rounded-xl break-all whitespace-pre-wrap" style={{ color: 'var(--color-success)' }}>
                                {signature ? `HMACSHA256(\n  base64UrlEncode(header) + "." +\n  base64UrlEncode(payload),\n  your-256-bit-secret\n)\n\n// Signature: ${signature.substring(0, 20)}...` : '// Signature'}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
