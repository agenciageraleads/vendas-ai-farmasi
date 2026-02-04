import { prisma } from '@/lib/prisma';
import { getDailyOpportunities } from '@/app/actions/crm';
import { getInventorySummary } from '@/app/actions/inventory';
import Link from 'next/link';
import CRMDashboardWidget from '@/components/crm/CRMWidget';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    try {
        // 1. Auth Mock
        const user = await prisma.user.findFirst({
            where: { email: 'lucas@vendaai.com' }
        }) || await prisma.user.findFirst();

        if (!user) return <div className="p-8 text-center">Usuário não encontrado. Configure o banco de dados.</div>;

        // 2. Fetch Data Parallel with error handling
        const [inventorySummary, opportunities] = await Promise.all([
            getInventorySummary(user.id).catch(err => {
                console.error('Inventory error:', err);
                return { totalItems: 0, totalCostValue: 0, lowStockCount: 0 };
            }),
            getDailyOpportunities(user.id).catch(err => {
                console.error('CRM error:', err);
                return [];
            })
        ]);

        return (
            <div className="min-h-screen pb-20 fade-in">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">
                                Cockpit 🛫
                            </h1>
                            <p className="text-[var(--text-secondary)] font-medium mt-1">
                                Bom dia, {user.name?.split(' ')[0]}. Sua loja está rodando.
                            </p>
                        </div>
                        <Link href="/dashboard/sales/new">
                            <Button variant="primary" size="md">
                                + Nova Venda
                            </Button>
                        </Link>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* KPI 1: Inventory Value */}
                        <Card variant="compact">
                            <p className="text-[var(--text-xs)] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                                Patrimônio em Estoque
                            </p>
                            <p className="text-2xl font-black text-[var(--text-primary)]">
                                R$ {inventorySummary.totalCostValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </Card>

                        {/* KPI 2: Sales (Mock) */}
                        <Card variant="compact">
                            <p className="text-[var(--text-xs)] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                                Vendas Mês (Est.)
                            </p>
                            <p className="text-2xl font-black text-[var(--success)]">
                                R$ 3.450,00
                            </p>
                        </Card>

                        {/* KPI 3: Alerts */}
                        <Card
                            variant="compact"
                            className={inventorySummary.lowStockCount > 0 ? 'bg-[var(--error-bg)] border-[var(--error)]' : ''}
                        >
                            <p className={`text-[var(--text-xs)] font-bold uppercase tracking-wider mb-2 ${inventorySummary.lowStockCount > 0 ? 'text-[var(--error)]' : 'text-[var(--text-tertiary)]'
                                }`}>
                                Produtos Baixos
                            </p>
                            <div className="flex items-center gap-2">
                                <span className={`text-2xl font-black ${inventorySummary.lowStockCount > 0 ? 'text-[var(--error)]' : 'text-[var(--text-primary)]'
                                    }`}>
                                    {inventorySummary.lowStockCount}
                                </span>
                                {inventorySummary.lowStockCount > 0 && (
                                    <Badge variant="error" size="md">Repor!</Badge>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Main Widgets Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Widget 1: CRM (Recall) */}
                        <div className="lg:col-span-2">
                            <CRMDashboardWidget opportunities={opportunities} />
                        </div>

                        {/* Widget 2: Quick Actions / Shortcuts */}
                        <Card className="bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-500)] text-white border-0 shadow-[var(--shadow-primary)]">
                            <div className="mb-6">
                                <h3 className="font-bold text-lg mb-1">Central Rápida</h3>
                                <p className="opacity-80 text-sm">Atalhos para gestão diária.</p>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href="/dashboard/inventory/entry"
                                    className="block bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl transition flex items-center gap-4 group"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition">📦</span>
                                    <div>
                                        <p className="font-bold">Entrada de Nota</p>
                                        <p className="text-xs opacity-70">Cadastrar produtos novos</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/dashboard/network/showcase"
                                    className="block bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl transition flex items-center gap-4 group"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition">🤝</span>
                                    <div>
                                        <p className="font-bold">Pedir Emprestado</p>
                                        <p className="text-xs opacity-70">Buscar na rede da líder</p>
                                    </div>
                                </Link>
                            </div>
                        </Card>

                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Dashboard error:', error);
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <Card>
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-bold text-red-600">⚠️ Erro no Dashboard</h1>
                        <p className="text-gray-600">
                            Ocorreu um erro ao carregar o dashboard.
                            Verifique se o banco de dados está configurado corretamente.
                        </p>
                        <p className="text-sm text-gray-400 font-mono">
                            {error instanceof Error ? error.message : 'Erro desconhecido'}
                        </p>
                    </div>
                </Card>
            </div>
        );
    }
}
