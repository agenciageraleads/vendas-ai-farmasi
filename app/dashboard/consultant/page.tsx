import { getConsultantInventory, getInventorySummary } from '@/app/actions/inventory';
import InventoryList from '@/components/InventoryList';
import QuickActionPanel from '@/components/QuickActionPanel';

export default async function ConsultantDashboard() {
    const { inventory, consultantName } = await getConsultantInventory();
    const summary = await getInventorySummary();

    return (
        <div className="space-y-10">
            {/* Layout em Grid para Scanner e Conteúdo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                {/* Coluna Principal: Métricas e Lista */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
                                Olá, {consultantName} ⚡
                            </h1>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                Sua performance hoje
                            </p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor Total</p>
                            <p className="text-2xl font-black text-gray-900 leading-tight">
                                R$ {summary.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Itens Ativos</p>
                            <p className="text-2xl font-black text-gray-900 leading-tight">{summary.totalItems}</p>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Alertas</p>
                            <p className={`text-2xl font-black leading-tight ${summary.lowStock > 0 ? 'text-pink-600' : 'text-green-500'}`}>
                                {summary.lowStock} Baixos
                            </p>
                        </div>
                    </div>

                    {/* Inventory List */}
                    <InventoryList inventory={inventory || []} />
                </div>

                {/* Coluna Lateral: Controle Geral / Scanner */}
                <div className="lg:sticky lg:top-24 space-y-6">
                    <QuickActionPanel />

                    {/* Dica de Uso */}
                    <div className="bg-gray-900 rounded-[2rem] p-8 text-white">
                        <h4 className="text-xs font-black uppercase tracking-widest mb-4">Dica Pro 💡</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Use o SKU do produto para registrar entradas ou vendas rápidas sem precisar abrir a lista completa.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
