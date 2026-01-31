'use client';

import { useState, useEffect } from 'react';
import { searchProducts } from '@/app/actions/catalog';
import { addStock } from '@/app/actions/inventory';

export default function StockEntryForm({ userId }: { userId: string }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const [quantity, setQuantity] = useState(1);
    const [unitCost, setUnitCost] = useState(0);
    const [location, setLocation] = useState('Casa');
    const [note, setNote] = useState('');
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
        setUnitCost(Number(prod.costPrice)); // Sugestão inicial
        setQuery('');
        setResults([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        try {
            const res = await addStock(userId, selectedProduct.sku, quantity, unitCost, location, note);
            if (res.success) {
                setFeedback({ type: 'success', msg: `Entrada realizada! Custo Médio será reajustado.` });
                // Reset critical fields
                setQuantity(1);
                setSelectedProduct(null);
                setQuery('');
            }
        } catch (err) {
            setFeedback({ type: 'error', msg: 'Erro ao processar entrada. Verifique os dados.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                📦 Entrada Manual de Estoque
            </h2>

            {feedback && (
                <div className={`p-4 mb-4 rounded-lg ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {feedback.msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Product Search */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Produto (Nome ou SKU)</label>
                    <input
                        type="text"
                        value={selectedProduct ? selectedProduct.name : query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (selectedProduct) setSelectedProduct(null);
                        }}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Ex: Perfume..."
                    />

                    {/* Dropdown Results */}
                    {results.length > 0 && !selectedProduct && (
                        <div className="absolute z-10 w-full bg-white border border-gray-100 shadow-xl rounded-lg mt-1 max-h-60 overflow-y-auto">
                            {results.map(prod => (
                                <div
                                    key={prod.id}
                                    onClick={() => handleSelect(prod)}
                                    className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0"
                                >
                                    <span className="font-medium text-gray-800">{prod.name}</span>
                                    <span className="text-sm text-gray-500 font-mono">{prod.sku}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedProduct && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div>
                            <label className="block text-xs uppercase font-semibold text-gray-500 mb-1">Quantidade</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-semibold text-gray-500 mb-1">
                                Custo Unitário (R$)
                                <span className="ml-1 text-xs normal-case text-blue-600 cursor-help" title="Valor pago por unidade nesta nota fiscal. Importante para o cálculo de lucro real.">ⓘ</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={unitCost}
                                onChange={(e) => setUnitCost(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-semibold text-gray-500 mb-1">Localização</label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                            >
                                <option value="Casa">Casa (Padrão)</option>
                                <option value="Carro">Carro / Mala</option>
                                <option value="Escritorio">Escritório</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-semibold text-gray-500 mb-1">Nota Fiscal / Obs</label>
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Ex: NF 4500..."
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={!selectedProduct || loading}
                        className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all
                            ${!selectedProduct || loading
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-black hover:bg-gray-800 hover:shadow-lg active:transform active:scale-95'
                            }`}
                    >
                        {loading ? 'Processando...' : 'Confirmar Entrada'}
                    </button>

                    {!selectedProduct && (
                        <p className="text-center text-sm text-gray-400 mt-2">
                            Selecione um produto para habilitar a entrada.
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
