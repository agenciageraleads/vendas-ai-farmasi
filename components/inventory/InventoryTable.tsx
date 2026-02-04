'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface LocationData {
    id: string;
    location: string;
    quantity: number;
    expiration?: Date;
}

interface ProductInventory {
    productId: string;
    productName: string;
    sku: string;
    imageUrl?: string;
    basePrice: number;
    totalQuantity: number;
    totalValue: number; // Sum of costAmount
    locations: LocationData[];
}

export default function InventoryTable({ inventory }: { inventory: ProductInventory[] }) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <Card>
            <div className="pb-4 mb-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold">
                    📦 Estoque Consolidado
                </h2>

                <div className="flex gap-2">
                    <Link href="/dashboard/inventory/transfer">
                        <Button variant="outline" size="sm">
                            🔄 Transferir
                        </Button>
                    </Link>
                    <Link href="/dashboard/inventory/entry">
                        <Button variant="primary" size="sm">
                            + Nova Entrada
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                            <th className="px-6 py-4">Produto</th>
                            <th className="px-6 py-4 text-center">Qtd Total</th>
                            <th className="px-6 py-4 text-right">Custo Médio</th>
                            <th className="px-6 py-4 text-right">Valor Total (Custo)</th>
                            <th className="px-6 py-4 text-center">Detalhes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {inventory.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                                    Nenhum produto em estoque. Faça uma entrada!
                                </td>
                            </tr>
                        ) : inventory.map((item) => {
                            const avgCost = item.totalQuantity > 0 ? item.totalValue / item.totalQuantity : 0;
                            const isExpanded = expanded[item.productId];

                            return (
                                <>
                                    <tr key={item.productId} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleExpand(item.productId)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs font-bold">
                                                    {item.sku.substring(0, 3)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800 text-sm">{item.productName}</div>
                                                    <div className="text-xs text-gray-400 font-mono">{item.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge
                                                variant={item.totalQuantity < 3 ? 'error' : 'success'}
                                                size="md"
                                            >
                                                {item.totalQuantity} un
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-sm text-gray-600">
                                            R$ {avgCost.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-sm font-bold text-gray-800">
                                            R$ {item.totalValue.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-gray-400 hover:text-blue-600 transition">
                                                {isExpanded ? '🔽' : '▶️'}
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expanded Details Row */}
                                    {isExpanded && (
                                        <tr className="bg-gray-50/50">
                                            <td colSpan={5} className="px-6 py-4">
                                                <div className="bg-white border border-gray-100 rounded-lg p-4">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">📍 Distribuição por Local</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {item.locations.map(loc => (
                                                            <div key={loc.id} className="flex justify-between items-center p-3 border border-gray-100 rounded bg-gray-50">
                                                                <span className="text-sm font-medium text-gray-700">{loc.location}</span>
                                                                <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">{loc.quantity} un</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4 text-right">
                                                        <Link href="#" className="text-xs text-blue-600 hover:underline">
                                                            Ver histórico de transações &rarr;
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
