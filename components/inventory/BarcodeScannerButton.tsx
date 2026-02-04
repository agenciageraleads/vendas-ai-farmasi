'use client';

import { useState } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import { searchProductBySKU } from '@/app/actions/catalog';

export default function BarcodeScannerButton() {
    const [showScanner, setShowScanner] = useState(false);
    const [scannedProduct, setScannedProduct] = useState<any>(null);

    const handleScan = async (code: string) => {
        setShowScanner(false);

        // Buscar produto por SKU
        const product = await searchProductBySKU(code);

        if (product) {
            setScannedProduct(product);
        } else {
            alert(`Produto com SKU "${code}" não encontrado.`);
        }
    };

    const closeProductModal = () => {
        setScannedProduct(null);
    };

    return (
        <>
            {/* Botão Flutuante de Scanner */}
            <button
                onClick={() => setShowScanner(true)}
                className="fixed bottom-24 right-6 z-30 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
                aria-label="Escanear código de barras"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
            </button>

            {/* Scanner Modal */}
            {showScanner && (
                <BarcodeScanner
                    onScan={handleScan}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* Modal de Produto Encontrado */}
            {scannedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Produto Encontrado</h3>
                            <button
                                onClick={closeProductModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            {scannedProduct.imageUrl && (
                                <img
                                    src={scannedProduct.imageUrl}
                                    alt={scannedProduct.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            )}

                            <div>
                                <p className="text-sm text-gray-500 font-medium">Nome</p>
                                <p className="text-lg font-bold text-gray-900">{scannedProduct.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">SKU</p>
                                    <p className="text-base font-bold text-gray-900">{scannedProduct.sku}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Preço</p>
                                    <p className="text-base font-bold text-primary-600">
                                        R$ {Number(scannedProduct.basePrice).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {scannedProduct.description && (
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Descrição</p>
                                    <p className="text-sm text-gray-700">{scannedProduct.description}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={closeProductModal}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition"
                                >
                                    Fechar
                                </button>
                                <button
                                    onClick={() => {
                                        // Aqui pode adicionar lógica para adicionar ao estoque
                                        alert('Funcionalidade de adicionar ao estoque será implementada');
                                        closeProductModal();
                                    }}
                                    className="flex-1 py-3 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 transition"
                                >
                                    Adicionar ao Estoque
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
