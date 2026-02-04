'use client';

import { useEffect, useRef, useState } from 'react';

interface BarcodeScannerProps {
    onScan: (code: string) => void;
    onClose: () => void;
}

/**
 * Componente de scanner de código de barras usando câmera do dispositivo
 * Requer biblioteca html5-qrcode
 */
export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Câmera traseira em mobile
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsScanning(true);
            }
        } catch (err) {
            console.error('Erro ao acessar câmera:', err);
            setError('Erro ao acessar câmera. Verifique as permissões do navegador.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const handleManualInput = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const code = formData.get('barcode') as string;
        if (code) {
            onScan(code);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Escanear Código</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>

                {/* Erro */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Vídeo da Câmera */}
                <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay de mira */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="border-4 border-primary-500 rounded-lg" style={{ width: '80%', height: '40%' }}>
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500"></div>
                        </div>
                    </div>
                </div>

                {/* Instruções */}
                <p className="text-sm text-gray-600 text-center mb-4">
                    {isScanning
                        ? 'Aponte a câmera para o código de barras do produto'
                        : 'Aguardando acesso à câmera...'}
                </p>

                {/* Input Manual (fallback) */}
                <form onSubmit={handleManualInput} className="border-t pt-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                        Ou digite o código manualmente:
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="barcode"
                            placeholder="Digite o SKU..."
                            className="flex-1 p-3 bg-gray-50 rounded-lg border-none text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 transition"
                        >
                            OK
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
