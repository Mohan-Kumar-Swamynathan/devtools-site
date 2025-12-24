import { useState, useCallback, useRef, useEffect } from 'react';
import { Download, Wifi } from 'lucide-react';
import ToolShell from './ToolShell';

export default function WifiQrCodeGenerator() {
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [encryption, setEncryption] = useState('WPA'); // WPA, WEP, nopass
    const [hidden, setHidden] = useState(false);
    const [qrSvg, setQrSvg] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generate = useCallback(() => {
        if (!ssid) {
            setQrSvg('');
            return;
        }

        // WIFI:T:WPA;S:MySSID;P:MyPassword;H:false;;
        // T: Authentication type; WPA|WEP|nopass
        // S: SSID
        // P: Password
        // H: Hidden SSID; true|false
        let wifiString = `WIFI:T:${encryption};S:${ssid};`;
        if (encryption !== 'nopass') {
            wifiString += `P:${password};`;
        }
        wifiString += `H:${hidden};;`;

        try {
            import('qrcode-generator').then((qrcode) => {
                // Type 0 = auto detect
                // Error correction: M = Medium (15%)
                const qr = qrcode.default(0, 'M');
                qr.addData(wifiString);
                qr.make();

                const svg = qr.createSvgTag({ cellSize: 8, margin: 4 });
                setQrSvg(svg);
            });
        } catch (e) {
            console.error(e);
        }
    }, [ssid, password, encryption, hidden]);

    // Generate on change with debounce could be nice, but simple effect is fine for now
    useEffect(() => {
        if (ssid) generate();
        else setQrSvg('');
    }, [ssid, password, encryption, hidden, generate]);

    const download = () => {
        if (!canvasRef.current || !qrSvg) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `wifi-${ssid}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            });
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(qrSvg);
    };

    const controls = null;

    return (
        <ToolShell className="space-y-8" controls={controls}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="label">Network Name (SSID)</label>
                        <input
                            type="text"
                            value={ssid}
                            onChange={(e) => setSsid(e.target.value)}
                            placeholder="e.g. MyHomeWiFi"
                            className="input-base"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="label">Password</label>
                        <input
                            type="text" // Show password for easier typing, it's a generator not a login
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Network Password"
                            className="input-base"
                            disabled={encryption === 'nopass'}
                        />
                    </div>

                    <div>
                        <label className="label">Encryption</label>
                        <select
                            value={encryption}
                            onChange={(e) => setEncryption(e.target.value)}
                            className="input-base"
                        >
                            <option value="WPA">WPA/WPA2/WPA3</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">None (Open)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="hidden-ssid"
                            checked={hidden}
                            onChange={(e) => setHidden(e.target.checked)}
                            className="checkbox"
                        />
                        <label htmlFor="hidden-ssid" className="text-sm select-none cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                            Hidden Network
                        </label>
                    </div>
                </div>

                {/* Output */}
                <div className="flex flex-col items-center justify-center p-8 rounded-2xl border bg-[var(--bg-secondary)]" style={{ borderColor: 'var(--border-primary)' }}>
                    {qrSvg ? (
                        <>
                            <div
                                className="bg-white p-4 rounded-xl mb-6 shadow-lg"
                                dangerouslySetInnerHTML={{ __html: qrSvg }}
                            />

                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{ssid}</h3>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                    {encryption === 'nopass' ? 'Open Network' : `Password: ${password}`}
                                </p>
                            </div>

                            <button onClick={download} className="btn-primary w-full max-w-[200px] flex items-center justify-center gap-2">
                                <Download size={18} />
                                Download QR
                            </button>
                            <canvas ref={canvasRef} className="hidden" />
                        </>
                    ) : (
                        <div className="text-center opacity-50">
                            <Wifi size={64} className="mx-auto mb-4" />
                            <p>Enter network details to generate QR code</p>
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
