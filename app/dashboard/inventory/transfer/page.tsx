import { prisma } from '@/lib/prisma';
import StockTransferForm from '@/components/inventory/StockTransferForm';

export const dynamic = 'force-dynamic';

export default async function InventoryTransferPage() {
    const user = await prisma.user.findFirst({
        where: { email: 'lucas@vendaai.com' }
    }) || await prisma.user.findFirst();

    if (!user) return <div>Usuário não encontrado</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Organizar Estoque</h1>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Mova produtos entre sua Casa, Carro ou Bolsa para saber sempre onde cada item está.</p>
                </div>

                <StockTransferForm userId={user.id} />

                <div className="mt-8 text-center">
                    <a href="/dashboard/inventory" className="text-xs font-bold text-gray-400 hover:text-gray-800 transition uppercase tracking-widest">
                        &larr; Voltar para Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
