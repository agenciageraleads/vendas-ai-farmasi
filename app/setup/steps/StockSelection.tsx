'use client';

import { useState } from 'react';
import { completeOnboarding } from '@/app/actions/onboarding';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    sku: string;
    name: string;
    imageUrl: string | null;
}

export default function StockSelection({ userId, products }: { userId: string, products: Product[] }) {
    const router = useRouter();
    const [selected, setSelected] = useState<Record<string, number>>({});
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.includes(search)
    );

    const handleQuantityChange = (sku: string, delta: number) => {
        setSelected(prev => {
            const current = prev[sku] || 0;
            const next = Math.max(0, current + delta);
            if (next === 0) {
                const { [sku]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [sku]: next };
        });
    };

    const handleFinish = async () => {
        setLoading(true);
        const stockItems = Object.entries(selected).map(([sku, qty]) => ({ sku, quantity: qty }));

        const res = await completeOnboarding(userId, stockItems);

        if (res.success) {
            router.push('/dashboard/inventory');
        } else {
            alert('Erro: ' + res.error);
            setLoading(false);
        }
    };

    const addStarterKit = () => {
        // Mock starter kit logic - picks first 5 items
        const kit = products.slice(0, 5);
        const updates: Record<string, number> = {};
        kit.forEach(p => updates[p.sku] = 1);
        setSelected(prev => ({ ...prev, ...updates }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <input
                    type="text"
                    placeholder="🔍 Buscar produto..."
                    className="w-full md:w-auto flex-1 p-3 rounded-lg border border-gray-200"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <button
                    onClick={addStarterKit}
                    className="px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-lg text-sm hover:bg-purple-200 transition"
                >
                    🎁 Tenho o Kit Início
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-96 overflow-y-auto p-2">
                {filtered.map(product => {
                    const qty = selected[product.sku] || 0;
                    return (
                        <div key={product.id} className={`p-4 rounded-xl border transition flex items-center gap-3 ${qty > 0 ? 'border-pink-500 bg-pink-50' : 'border-gray-100 bg-white'}`}>
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt="" className="w-12 h-12 rounded bg-gray-200 object-cover" />
                            ) : (
                                <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">
                                    {product.sku.slice(0, 2)}
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate text-gray-800">{product.name}</p>
                                <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                {qty > 0 && (
                                    <button onClick={() => handleQuantityChange(product.sku, -1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-100">-</button>
                                )}
                                <span className={`font-bold w-6 text-center ${qty > 0 ? 'text-pink-600' : 'text-gray-300'}`}>{qty > 0 ? qty : '+'}</span>
                                <button onClick={() => handleQuantityChange(product.sku, 1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-100">+</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <p className="text-gray-500 font-medium">
                    <span className="text-pink-600 font-bold">{Object.keys(selected).length}</span> produtos selecionados
                </p>
                <button
                    onClick={handleFinish}
                    disabled={loading}
                    className="px-8 py-4 bg-pink-600 text-white font-black rounded-xl hover:bg-pink-700 shadow-xl shadow-pink-200 transition transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Finalizando...' : 'Concluir Setup 🎉'}
                </button>
            </div>
        </div>
    );
}
