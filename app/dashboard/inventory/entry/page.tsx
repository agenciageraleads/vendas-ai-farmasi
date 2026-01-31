import { prisma } from '@/lib/prisma';
import StockEntryForm from '@/components/inventory/StockEntryForm';

export default async function InventoryEntryPage() {
    // Mock user for MVP - in production use session/auth
    const user = await prisma.user.findFirst({
        where: { email: 'lucas@vendaai.com' } // Fallback or current user
    }) || await prisma.user.findFirst(); // Fallback to any user

    if (!user) return <div className="p-10 text-center">Usuário não encontrado. Rode o seed.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Entrada de Estoque</h1>
                    <p className="text-gray-500">
                        Registre novas aquisições para manter seu Preço Médio atualizado.
                        Futuramente você poderá importar o XML da Nota Fiscal aqui.
                    </p>
                </div>

                <StockEntryForm userId={user.id} />

                <div className="mt-8 text-center">
                    <button disabled className="text-sm text-gray-400 border border-dashed border-gray-300 px-4 py-2 rounded-lg cursor-not-allowed bg-white">
                        📥 Importar XML (Em Breve)
                    </button>
                </div>
            </div>
        </div>
    );
}
