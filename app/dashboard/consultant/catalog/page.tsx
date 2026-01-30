'use client';

import { useEffect, useState } from 'react';
import { getGlobalCatalog, addToInventory } from '@/app/actions/catalog';
import { useRouter } from 'next/navigation';

export default function CatalogPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        getGlobalCatalog().then(data => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const handleAdd = async (productId: string) => {
        setAddingId(productId);
        const result = await addToInventory(productId);
        setAddingId(null);

        if (result.success) {
            alert('Produto adicionado ao seu estoque!');
            router.push('/dashboard/consultant');
        } else {
            alert(result.error);
        }
    };

    if (loading) return <div className="p-8 text-center">Carregando catálogo...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Catálogo Farmasi 🧬</h1>
                <p className="text-gray-500">Selecione os produtos que você tem em mãos para gerenciar seu estoque.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
                        <div className="h-40 bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-gray-300 font-bold border-2 border-dashed border-gray-100 uppercase tracking-widest text-xs">
                            {p.sku}
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{p.name}</h3>
                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{p.description}</p>

                        <div className="flex items-center justify-between mt-auto">
                            <span className="font-black text-gray-900">R$ {Number(p.basePrice).toFixed(2)}</span>
                            <button
                                onClick={() => handleAdd(p.id)}
                                disabled={addingId === p.id}
                                className="bg-pink-600 text-white text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 transition"
                            >
                                {addingId === p.id ? 'ADICIONANDO...' : '+ ESTOQUE'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
