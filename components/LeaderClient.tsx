'use client';

import { useState } from 'react';
import { getTeamMemberDetails } from '@/app/actions/team-member';

export default function LeaderClient({ teamMembers }: { teamMembers: any[] }) {
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const viewDetails = async (memberId: string) => {
        setLoading(true);
        const details = await getTeamMemberDetails(memberId);
        setSelectedMember(details);
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
            <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-white">
                <div>
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest italic">Detalhamento da Equipe</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Status e volume individual</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-50">
                    <thead>
                        <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <th className="px-10 py-6">Consultor</th>
                            <th className="px-10 py-6">Vendas (Total)</th>
                            <th className="px-10 py-6 text-center">Amostras</th>
                            <th className="px-10 py-6">Estoque</th>
                            <th className="px-10 py-6 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {teamMembers.map((member: any) => (
                            <tr key={member.id} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all text-xs">
                                            {member.name?.substring(0, 1)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-800 tracking-tight">{member.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{member.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <p className="text-sm font-black text-green-600 leading-none">R$ {member.totalSalesValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{member.totalSalesCount} pedidos</p>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase ${member.openSamples > 0 ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {member.openSamples} Ativas 🧪
                                    </span>
                                </td>
                                <td className="px-10 py-8">
                                    <p className="text-sm font-black text-gray-900 leading-none">R$ {member.inventoryValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <button
                                        onClick={() => viewDetails(member.id)}
                                        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline active:scale-95 transition-all outline-none"
                                    >
                                        Ver Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            {selectedMember && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        <div className="p-10 border-b border-gray-50 flex justify-between items-start bg-gradient-to-br from-white to-indigo-50/30">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">{selectedMember.name}</h3>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mt-2">Perfil do Consultor</p>
                            </div>
                            <button onClick={() => setSelectedMember(null)} className="text-gray-400 hover:text-gray-900 text-2xl font-black">×</button>
                        </div>

                        <div className="p-10 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Left: Inventory */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estoque Atual</h4>
                                <div className="space-y-3">
                                    {selectedMember.inventory.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-800">{item.product.name}</span>
                                                <span className="text-[10px] font-bold text-gray-400">{item.location}</span>
                                            </div>
                                            <span className={`text-sm font-black ${item.quantity < 3 ? 'text-pink-600' : 'text-gray-900'}`}>{item.quantity}u</span>
                                        </div>
                                    ))}
                                    {selectedMember.inventory.length === 0 && <p className="text-xs text-gray-400 italic">Nenhum item em estoque.</p>}
                                </div>
                            </div>

                            {/* Right: Recent Sales */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendas Recentes</h4>
                                <div className="space-y-3">
                                    {selectedMember.sales.map((order: any) => (
                                        <div key={order.id} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg uppercase">R$ {order.total.toFixed(2)}</span>
                                                <span className="text-[10px] font-bold text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-[10px] font-black text-gray-800 uppercase line-clamp-1">{order.customerName}</p>
                                        </div>
                                    ))}
                                    {selectedMember.sales.length === 0 && <p className="text-xs text-gray-400 italic">Nenhuma venda registrada.</p>}
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-gray-50 bg-gray-50/50 flex gap-4">
                            <button className="flex-1 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl hover:bg-indigo-600 transition-all">Sugerir Reposição</button>
                            <button className="flex-1 bg-white border border-gray-200 text-gray-500 font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-50 transition-all">Ligar para Consultor</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
