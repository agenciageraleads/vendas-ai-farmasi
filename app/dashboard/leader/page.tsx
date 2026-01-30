import { getLeaderData } from '@/app/actions/leader';
import Link from 'next/link';
import LeaderClient from '@/components/LeaderClient';

export default async function LeaderDashboard() {
    const data = await getLeaderData();

    if (!data) return <div className="p-10">Líder não encontrado.</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Premium Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black text-indigo-600 tracking-tighter italic">LIDERANÇA FARMASI</h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Workspace de {data.leaderName}</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/consultant" className="text-xs font-black text-gray-400 hover:text-indigo-600 uppercase tracking-widest">Minha Visão Pessoal</Link>
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-200">
                            {data.leaderName.substring(0, 1)}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Desempenho <br /> Da Equipe 🚀</h2>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Gestão de alta performance</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-indigo-600 text-white px-6 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                            Enviar Mensagem para Time
                        </button>
                    </div>
                </div>

                {/* Global Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Main Volume */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-gray-50 relative overflow-hidden group">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Capital em Estoque</p>
                        <p className="text-3xl font-black text-indigo-600 leading-none tracking-tighter">
                            R$ {data.teamTotalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-green-500/5 border border-gray-50 relative overflow-hidden group">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Vendas (Mensal)</p>
                        <p className="text-3xl font-black text-green-600 leading-none tracking-tighter">
                            R$ {data.teamTotalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Health Stats */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</p>
                                <p className="text-xl font-black text-gray-900 leading-none">{data.teamSize}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg">👥</div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Alertas</p>
                                <p className="text-xl font-black text-pink-600 leading-none">{data.teamTotalLowStock}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-lg">⚠️</div>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 text-white flex flex-col justify-between">
                        <h4 className="text-[8px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">Produtos Foco do Time</h4>
                        <div className="space-y-3">
                            {data.topProducts.map((p: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="text-xs font-black tracking-tight line-clamp-1">{p.name}</span>
                                    <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded-lg">{p.qty}u</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team List with Client Logic */}
                <LeaderClient teamMembers={data.teamMembers} />

            </main>

            <footer className="bg-gray-900 py-16 px-4 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Venda AI / Liderança Farmasi 2026</p>
                </div>
            </footer>
        </div>
    );
}
