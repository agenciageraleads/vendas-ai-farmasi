'use client';

import { useState } from 'react';
import { getActionDataBySku, updateInventoryItem, openSample } from '@/app/actions/inventory';
import { createOrder } from '@/app/actions/orders';
import { addToInventory } from '@/app/actions/catalog';
import { useRouter } from 'next/navigation';

export default function QuickActionScanner() {
    const [sku, setSku] = useState('');
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'menu' | 'entry' | 'sale' | 'move'>('menu');
    const router = useRouter();

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sku) return;

        setLoading(true);
        const result = await getActionDataBySku(sku);
        setLoading(false);

        if (result.error) {
            alert(result.error);
        } else {
            setProductData(result);
            setActiveTab('menu');
        }
    };

    const handleEntry = async (qty: number) => {
        setLoading(true);
        if (productData.inventoryItem) {
            await updateInventoryItem(productData.inventoryItem.id, {
                quantity: productData.inventoryItem.quantity + qty
            });
        } else {
            // Se não existe, cria via catálogo
            await addToInventory(productData.product.id);
            // Se qty > 1, precisa atualizar o recém criado
            if (qty > 1) {
                const fresh = await getActionDataBySku(productData.product.sku);
                if (fresh.inventoryItem) {
                    await updateInventoryItem(fresh.inventoryItem.id, { quantity: qty });
                }
            }
        }
        setLoading(false);
        reset();
        router.refresh();
    };

    const handleQuickSale = async () => {
        if (!productData.inventoryItem || productData.inventoryItem.quantity < 1) {
            return alert("Estoque insuficiente para venda.");
        }

        setLoading(true);
        const result = await createOrder({
            sellerId: productData.userId,
            customerName: 'Venda Rápida (Cliente Final)',
            customerPhone: '',
            items: [{
                productId: productData.product.id,
                quantity: 1,
                unitPrice: productData.product.basePrice
            }]
        });
        setLoading(false);

        if (result.success) {
            alert('Venda registrada com sucesso!');
            reset();
            router.refresh();
        } else {
            alert(result.error);
        }
    };

    const reset = () => {
        setSku('');
        setProductData(null);
        setActiveTab('menu');
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-pink-500/10 p-8 border border-gray-50">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-pink-600 flex items-center justify-center text-white shadow-lg shadow-pink-200">
                    <span className="text-xl">📷</span>
                </div>
                <div>
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Controle Geral</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Escaneie ou digite o SKU</p>
                </div>
            </div>

            {!productData ? (
                <form onSubmit={handleScan} className="flex gap-2">
                    <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value.toUpperCase())}
                        placeholder="EX: BAT-001"
                        className="flex-1 bg-gray-50 border-none ring-1 ring-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-pink-500 transition-all outline-none"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-600 transition-all active:scale-95"
                    >
                        {loading ? '...' : 'LOCALIZAR'}
                    </button>
                </form>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header do Produto */}
                    <div className="flex items-start justify-between bg-pink-50/50 p-6 rounded-3xl mb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center font-black text-pink-600 border border-pink-100">
                                {productData.product.name.substring(0, 1)}
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900 leading-tight">{productData.product.name}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{productData.product.sku}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-[10px] font-black bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full uppercase">
                                        {productData.inventoryItem?.quantity || 0} em estoque
                                    </span>
                                    <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-0.5 rounded-full uppercase">
                                        R$ {productData.product.basePrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={reset} className="text-gray-300 hover:text-gray-900 text-xl font-black">×</button>
                    </div>

                    {/* Menu de Ações */}
                    {activeTab === 'menu' && (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setActiveTab('entry')}
                                className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-100 rounded-3xl hover:border-pink-500 hover:bg-pink-50 transition-all group"
                            >
                                <span className="text-2xl grayscale group-hover:grayscale-0 transition">📥</span>
                                <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-pink-600 tracking-widest">Entrada</span>
                            </button>
                            <button
                                onClick={handleQuickSale}
                                className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-100 rounded-3xl hover:border-green-500 hover:bg-green-50 transition-all group"
                            >
                                <span className="text-2xl grayscale group-hover:grayscale-0 transition">💰</span>
                                <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-green-600 tracking-widest">Venda</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('move')}
                                className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-100 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                            >
                                <span className="text-2xl grayscale group-hover:grayscale-0 transition">📍</span>
                                <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-indigo-600 tracking-widest">Mover</span>
                            </button>
                            <button
                                onClick={async () => {
                                    if (confirm('Marcar como amostra aberta hoje?')) {
                                        await openSample(productData.inventoryItem.id);
                                        reset();
                                        router.refresh();
                                    }
                                }}
                                className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-100 rounded-3xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
                            >
                                <span className="text-2xl grayscale group-hover:grayscale-0 transition">🧪</span>
                                <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-purple-600 tracking-widest">Amostra</span>
                            </button>
                        </div>
                    )}

                    {/* Tela de Entrada */}
                    {activeTab === 'entry' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantas unidades entraram?</label>
                            <div className="flex gap-2">
                                {[1, 2, 5, 10].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => handleEntry(n)}
                                        className="flex-1 py-4 bg-gray-50 rounded-2xl font-black text-gray-900 border border-gray-100 hover:bg-pink-600 hover:text-white transition-all"
                                    >
                                        +{n}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setActiveTab('menu')}
                                className="w-full text-center text-[10px] font-black text-gray-400 uppercase tracking-widest pt-4 hover:text-gray-900"
                            >
                                Voltar ao Menu
                            </button>
                        </div>
                    )}

                    {/* Tela de Movimentação */}
                    {activeTab === 'move' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Novo Local</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Casa', 'Bolsa', 'Carro', 'Loja'].map(loc => (
                                    <button
                                        key={loc}
                                        onClick={async () => {
                                            await updateInventoryItem(productData.inventoryItem.id, { location: loc });
                                            reset();
                                            router.refresh();
                                        }}
                                        className="py-4 bg-gray-50 rounded-2xl font-black text-gray-900 border border-gray-100 hover:bg-indigo-600 hover:text-white transition-all text-xs"
                                    >
                                        {loc}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setActiveTab('menu')}
                                className="w-full text-center text-[10px] font-black text-gray-400 uppercase tracking-widest pt-4 hover:text-gray-900"
                            >
                                Voltar ao Menu
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
