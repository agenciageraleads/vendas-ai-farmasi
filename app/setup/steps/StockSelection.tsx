'use client';

import { useState, useMemo } from 'react';
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

    // Optimized filtering
    const filtered = useMemo(() => {
        const s = search.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(s) ||
            p.sku.toLowerCase().includes(s)
        );
    }, [products, search]);

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
        if (loading) return;
        setLoading(true);
        try {
            const stockItems = Object.entries(selected).map(([sku, qty]) => ({ sku, quantity: qty }));
            const res = await completeOnboarding(userId, stockItems);

            if (res.success) {
                router.push('/dashboard/inventory');
            } else {
                alert('Erro: ' + res.error);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert('Erro inesperado');
            setLoading(false);
        }
    };

    const addStarterKit = () => {
        const kit = products.slice(0, 5);
        const updates: Record<string, number> = {};
        kit.forEach(p => updates[p.sku] = 1);
        setSelected(prev => ({ ...prev, ...updates }));
    };

    const totalItems = Object.values(selected).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-8 pb-32"> {/* heavy bottom padding for sticky footer */}

            {/* Search & Actions Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center sticky top-20 z-20 backdrop-blur-md bg-white/90">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">🔍</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou código..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={addStarterKit}
                        className="flex-1 md:flex-none px-6 py-3 bg-purple-50 text-purple-700 font-bold rounded-xl text-sm hover:bg-purple-100 transition border border-purple-100 flex items-center justify-center gap-2"
                    >
                        🎁 <span className="hidden sm:inline">Adicionar</span> Kit Início
                    </button>
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="px-4 py-3 text-gray-500 hover:text-gray-700 font-medium transition"
                        >
                            Limpar
                        </button>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(product => {
                    const qty = selected[product.sku] || 0;
                    const isSelected = qty > 0;

                    return (
                        <div
                            key={product.id}
                            className={`
                                group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden
                                ${isSelected
                                    ? 'border-primary-500 ring-1 ring-primary-500 shadow-xl shadow-primary-500/10'
                                    : 'border-gray-100 hover:border-gray-300 hover:shadow-lg'
                                }
                            `}
                        >
                            <div className="flex p-4 gap-4 items-center">
                                {/* Image / Avatar */}
                                <div className={`
                                    w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors
                                    ${product.imageUrl ? 'bg-gray-100' : 'bg-gray-50 text-gray-400'}
                                    ${isSelected ? 'bg-primary-50 text-primary-600' : ''}
                                `}>
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <span>{product.sku.slice(0, 3)}</span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-bold text-sm truncate mb-1 ${isSelected ? 'text-primary-700' : 'text-gray-800'}`}>
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-mono tracking-wide bg-gray-50 inline-block px-1.5 py-0.5 rounded">
                                        {product.sku}
                                    </p>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className={`
                                p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between transition-colors
                                ${isSelected ? 'bg-primary-50/50 border-primary-100' : ''}
                            `}>
                                <div className="text-xs font-medium text-gray-500">
                                    {isSelected ? 'Em estoque:' : 'Adicionar ao estoque'}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleQuantityChange(product.sku, -1)}
                                        disabled={!isSelected}
                                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center shadow-sm"
                                    >
                                        -
                                    </button>
                                    <span className={`font-bold w-6 text-center ${isSelected ? 'text-primary-600' : 'text-gray-300'}`}>
                                        {qty}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(product.sku, 1)}
                                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-primary-600 font-bold hover:bg-primary-50 hover:border-primary-200 transition flex items-center justify-center shadow-sm active:scale-95"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        <p className="text-lg">Nenhum produto encontrado. 🤔</p>
                    </div>
                )}
            </div>

            {/* Sticky Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden sm:block">
                        <p className="text-sm text-gray-500">
                            Produtos selecionados: <strong className="text-gray-900 text-lg">{Object.keys(selected).length}</strong>
                        </p>
                        <p className="text-xs text-gray-400">Total de itens: {totalItems}</p>
                    </div>

                    <div className="flex-1 sm:flex-none flex justify-end gap-4">
                        <div className="sm:hidden flex flex-col justify-center mr-auto">
                            <span className="text-xs font-bold text-gray-500 uppercase">Resumo</span>
                            <span className="font-bold text-gray-900">{Object.keys(selected).length} Prod / {totalItems} Itens</span>
                        </div>

                        <button
                            onClick={handleFinish}
                            disabled={loading || totalItems === 0}
                            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Finalizando...' : 'Concluir Setup e Acessar 🚀'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
