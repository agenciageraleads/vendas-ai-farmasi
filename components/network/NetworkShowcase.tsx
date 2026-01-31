'use client';

import { useState } from 'react';
import { createBorrowRequest } from '@/app/actions/collaboration';

// Types
interface Holder {
    userId: string;
    userName: string;
    quantity: number;
    location: string;
}

interface ShowcaseItem {
    productId: string;
    productName: string;
    sku: string;
    imageUrl?: string;
    basePrice: number;
    holders: Holder[];
}

export default function NetworkShowcase({ items, userId }: { items: ShowcaseItem[], userId: string }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [requesting, setRequesting] = useState<string | null>(null);

    // Filter
    const filteredItems = items.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.includes(searchTerm)
    );

    const handleRequest = async (holder: Holder, productId: string, productName: string) => {
        if (!confirm(`Solicitar 1 unidade de ${productName} para ${holder.userName}?`)) return;

        setRequesting(holder.userId + productId);

        const res = await createBorrowRequest(userId, holder.userId, productId, 1);

        setRequesting(null);

        if (res.success) {
            alert('Solicitação enviada! Aguarde a aprovação do painel do seu colega.');
        } else {
            alert(res.error || 'Erro ao solicitar.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="🔍 O que você precisa pedir emprestado?"
                    className="w-full p-4 pl-12 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🤝</span>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.productId} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-purple-900/5 hover:-translate-y-1 transition duration-300">

                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-800 line-clamp-2">{item.productName}</h3>
                                <p className="text-xs text-gray-400 font-mono mt-1">{item.sku}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 font-bold text-xs">
                                {item.sku.substring(0, 2)}
                            </div>
                        </div>

                        {/* Holders List */}
                        <div className="bg-gray-50 rounded-xl p-3 space-y-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Disponível com:</p>

                            {item.holders.map((holder, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                                            {holder.userName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-700">{holder.userName}</p>
                                            <p className="text-[10px] text-gray-400">{holder.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-gray-800">{holder.quantity}un</span>
                                        {holder.userId !== userId && (
                                            <button
                                                onClick={() => handleRequest(holder, item.productId, item.productName)}
                                                disabled={!!requesting}
                                                className="w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200 transition disabled:opacity-50"
                                                title="Solicitar produto"
                                            >
                                                {requesting === (holder.userId + item.productId) ? '...' : '👋'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p>Nenhum parceiro tem esse produto disponível agora. 🫤</p>
                </div>
            )}
        </div>
    );
}
