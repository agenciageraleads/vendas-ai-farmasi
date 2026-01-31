'use client';

import { useState, useEffect } from 'react';
import { transferStockAction } from '@/app/actions/transfer';
import { searchProducts } from '@/app/actions/catalog';

export default function StockTransferForm({ userId }: { userId: string }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const [quantity, setQuantity] = useState(1);
    const [fromLocation, setFromLocation] = useState('Casa');
    const [toLocation, setToLocation] = useState('Carro');

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                const prods = await searchProducts(query);
                setResults(prods);
            } else {
                setResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (prod: any) => {
        setSelectedProduct(prod);
        setQuery('');
        setResults([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        const res = await transferStockAction(userId, selectedProduct.sku, quantity, fromLocation, toLocation);

        if (res.success) {
            setFeedback({ type: 'success', msg: `Transferência de ${quantity}un realizada com sucesso!` });
            setSelectedProduct(null);
            setQuantity(1);
        } else {
            setFeedback({ type: 'error', msg: res.error || 'Erro na transferência.' });
        }

        setLoading(false);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🔄 Mover Estoque Interno
            </h2>

            {feedback && (
                <div className={`p-4 mb-4 rounded-lg text-sm font-bold ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {feedback.msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Product Search */}
                <div className="relative">
                    <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Qual produto?</label>
                    <input
                        type="text"
                        value={selectedProduct ? selectedProduct.name : query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (selectedProduct) setSelectedProduct(null);
                        }}
                        className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold text-gray-800 outline-none transition"
                        placeholder="Digite o nome ou SKU..."
                    />

                    {results.length > 0 && !selectedProduct && (
                        <div className="absolute z-10 w-full bg-white border border-gray-100 shadow-xl rounded-xl mt-2 max-h-60 overflow-y-auto">
                            {results.map(prod => (
                                <div
                                    key={prod.id}
                                    onClick={() => handleSelect(prod)}
                                    className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0"
                                >
                                    <span className="font-bold text-gray-800 text-sm">{prod.name}</span>
                                    <span className="text-xs font-mono text-gray-400">{prod.sku}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedProduct && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        {/* Locations */}
                        <div className="col-span-2 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                            <div>
                                <label className="block text-xs uppercase font-bold text-gray-400 mb-1">De (Origem)</label>
                                <select
                                    value={fromLocation}
                                    onChange={(e) => setFromLocation(e.target.value)}
                                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700"
                                >
                                    <option value="Casa">Casa</option>
                                    <option value="Carro">Carro</option>
                                    <option value="Escritorio">Escritório</option>
                                </select>
                            </div>
                            <div className="flex flex-col justify-end relative">
                                <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 bg-white rounded-full p-1 border border-gray-200 z-10">
                                    ➡️
                                </div>
                                <label className="block text-xs uppercase font-bold text-gray-400 mb-1 pl-4">Para (Destino)</label>
                                <select
                                    value={toLocation}
                                    onChange={(e) => setToLocation(e.target.value)}
                                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700"
                                >
                                    <option value="Carro">Carro</option>
                                    <option value="Casa">Casa</option>
                                    <option value="Escritorio">Escritório</option>
                                    <option value="Bolsa">Bolsa</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Quantidade</label>
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-xl text-gray-600">-</button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="flex-1 text-center p-3 bg-white border-2 border-gray-100 rounded-xl font-black text-xl text-gray-800"
                                />
                                <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-xl text-gray-600">+</button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!selectedProduct || loading}
                    className={`w-full py-4 text-sm uppercase tracking-widest font-black rounded-xl transition-all shadow-lg
                        ${!selectedProduct || loading
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300'
                        }`}
                >
                    {loading ? 'Movendo...' : 'Confirmar Transferência'}
                </button>
            </form>
        </div>
    );
}
