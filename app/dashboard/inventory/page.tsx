import { prisma } from '@/lib/prisma';
import { getConsultantInventory, getInventorySummary } from '@/app/actions/inventory';
import InventoryTable from '@/components/inventory/InventoryTable';

export default async function InventoryDashboardPage() {
    // Mock user for MVP
    const user = await prisma.user.findFirst({
        where: { email: 'lucas@vendaai.com' }
    }) || await prisma.user.findFirst();

    if (!user) return <div className="p-10 text-center">Usuário não encontrado. Rode o seed.</div>;

    // Fetch grouped data
    const inventoryData = await getConsultantInventory(user.id);
    const summary = await getInventorySummary(user.id);

    if ('error' in inventoryData) {
        return <div className="p-10 text-center">Erro: {inventoryData.error}</div>;
    }

    const { inventory, consultantName } = inventoryData;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestão de Estoque</h1>
                        <p className="text-gray-500">Olá, {consultantName}. Gerencie seu patrimônio aqui.</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Patrimônio (Custo)</p>
                        <p className="text-2xl font-black text-gray-900 mt-1">
                            R$ {summary.totalCostValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Itens Totais</p>
                        <p className="text-2xl font-black text-blue-600 mt-1">
                            {summary.totalItems} un
                        </p>
                    </div>
                    <div className={`p-6 rounded-xl shadow-sm border border-gray-100 ${summary.lowStockCount > 0 ? 'bg-red-50 border-red-100' : 'bg-white'}`}>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Alertas de Baixo Estoque</p>
                        <p className={`text-2xl font-black mt-1 ${summary.lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {summary.lowStockCount} produtos
                        </p>
                    </div>
                </div>

                {/* Main Table */}
                <InventoryTable inventory={inventory || []} />
            </div>
        </div>
    );
}
