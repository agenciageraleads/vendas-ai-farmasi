'use client';

import { useState, useEffect } from 'react';
import { updateInventoryItem, openSample } from '@/app/actions/inventory';
import { useRouter } from 'next/navigation';

export default function InventoryList({ inventory }: { inventory: any[] }) {
    const router = useRouter();
    const [editingItem, setEditingItem] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Helper to calculate days open
    const getDaysOpen = (date: any) => {
        if (!date) return null;
        const opened = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - opened.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        setLoading(true);
        const result = await updateInventoryItem(editingItem.id, {
            quantity: Number(editingItem.quantity),
            location: editingItem.location,
        });
        setLoading(false);

        if (result.success) {
            setEditingItem(null);
            router.refresh();
        } else {
            alert(result.error);
        }
    };

    const handleOpenSample = async (id: string) => {
        if (!confirm('Abrir este produto como amostra? Isso marcará o início do uso para rastreamento.')) return;

        setLoading(true);
        const result = await openSample(id);
        setLoading(false);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-pink-500/5 border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Meu Estoque Ativo</h2>
                </div>
                <button className="text-[10px] font-black uppercase text-pink-600 bg-pink-50 px-4 py-2 rounded-xl hover:bg-pink-100 transition-all">
                    Importar Catálogo
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-50">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Produto</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Localização</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantidade</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status / Amostra</th>
                            <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {inventory?.map((item) => {
                            const daysOpen = getDaysOpen(item.openedAt);
                            return (
                                <tr key={item.id} className="hover:bg-pink-50/30 transition-all duration-300 group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 bg-pink-100 rounded-2xl flex-shrink-0 flex items-center justify-center text-pink-600 text-lg font-black shadow-inner">
                                                {item.product.name.substring(0, 1)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-black text-gray-800 tracking-tight">{item.product.name}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.product.sku}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                            <span className="text-lg">📍</span> {item.location}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-black ${item.quantity < 3 ? 'text-orange-500' : 'text-gray-900'}`}>
                                                {item.quantity}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">UN</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {item.openedAt ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-full w-fit uppercase tracking-tighter">
                                                    Amostra Ativa 🧪
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 italic">
                                                    Aberta há {daysOpen} dias
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black rounded-full uppercase tracking-tighter">
                                                Fechado / Venda 📦
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right space-x-2">
                                        {!item.openedAt && (
                                            <button
                                                onClick={() => handleOpenSample(item.id)}
                                                className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition"
                                            >
                                                Abrir Amostra
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setEditingItem({ ...item })}
                                            className="text-[10px] font-black text-pink-600 hover:text-pink-800 uppercase tracking-widest transition"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10 border-b border-gray-50 bg-gradient-to-br from-white to-pink-50/50">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Ajustar <br /> Estoque</h3>
                            <p className="text-xs font-bold text-pink-500 mt-2 uppercase tracking-widest">{editingItem.product.name}</p>
                        </div>

                        <form onSubmit={handleUpdate} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Para onde vai?</label>
                                <select
                                    value={editingItem.location}
                                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                                    className="w-full bg-gray-50 border-none ring-1 ring-gray-100 text-gray-900 text-sm font-bold rounded-2xl focus:ring-2 focus:ring-pink-500 block p-4 transition-all"
                                >
                                    <option value="Casa - Estoque">🏠 Casa - Estoque</option>
                                    <option value="Bolsa de Vendas">👜 Bolsa de Vendas</option>
                                    <option value="Carro">🚗 Carro</option>
                                    <option value="Emprestado">🤝 Emprestado</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantas unidades?</label>
                                <input
                                    type="number"
                                    value={editingItem.quantity}
                                    onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                                    className="w-full bg-gray-50 border-none ring-1 ring-gray-100 text-gray-900 text-sm font-bold rounded-2xl focus:ring-2 focus:ring-pink-500 block p-4 transition-all"
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="flex-1 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition"
                                >
                                    Descartar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-gray-200 hover:bg-pink-600 hover:shadow-pink-100 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'Salvando...' : 'Confirmar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
