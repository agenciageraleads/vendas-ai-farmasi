'use client';

import { useState } from 'react';
import { approveRequest, rejectRequest } from '@/app/actions/collaboration';

interface Request {
    id: string;
    quantity: number;
    requester: { name: string; email: string };
    product: { name: string; sku: string; imageUrl: string };
    createdAt: Date;
}

export default function RequestManager({ requests, userId }: { requests: any[], userId: string }) {
    const [pending, setPending] = useState(requests);
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
        setLoadingMap(prev => ({ ...prev, [id]: true }));

        let res;
        if (action === 'APPROVE') res = await approveRequest(id, userId);
        else res = await rejectRequest(id, userId);

        setLoadingMap(prev => ({ ...prev, [id]: false }));

        if (res.success) {
            setPending(prev => prev.filter(r => r.id !== id));
            // Show toast success
        } else {
            alert(res.error);
        }
    };

    if (pending.length === 0) {
        return (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
                <p className="text-gray-400 font-medium">Nenhuma solicitação pendente. Tudo calmo por aqui. 🍃</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Solicitações Pendentes ({pending.length})</h3>

            {pending.map(req => (
                <div key={req.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">

                    <div className="flex items-center gap-4 w-full">
                        <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center text-2xl">
                            🙋‍♂️
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                <span className="font-bold text-gray-900">{req.requester.name}</span> pede:
                            </p>
                            <p className="font-black text-gray-800 text-lg">
                                {req.quantity}x {req.product.name}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">{req.product.sku}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => handleAction(req.id, 'REJECT')}
                            disabled={loadingMap[req.id]}
                            className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-red-100 text-red-600 font-bold text-xs hover:bg-red-50 transition"
                        >
                            Negar
                        </button>
                        <button
                            onClick={() => handleAction(req.id, 'APPROVE')}
                            disabled={loadingMap[req.id]}
                            className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-green-600 text-white font-bold text-xs hover:bg-green-700 shadow-lg shadow-green-100 transition transform active:scale-95 disabled:opacity-50"
                        >
                            {loadingMap[req.id] ? '...' : '✅ Aprovar Saída'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
